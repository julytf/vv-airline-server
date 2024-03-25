import { populate } from 'dotenv'
import config from '@/config'
import { FlightType } from '@/enums/flight.enums'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { PassengerType } from '@/enums/passenger.enums'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enums'
import { SeatClass } from '@/enums/seat.enums'
import { UserGender } from '@/enums/user.enums'
import Seat, { ISeat } from '@/models/aircraft/seat.model'
import Booking from '@/models/booking/booking.model'
import Passenger from '@/models/booking/passenger.model'
import Reservation, { IReservation } from '@/models/booking/reservation.model'
import { IAirport } from '@/models/flight/airport.model'
import Flight, { IFlight } from '@/models/flight/flight.model'
import { IFlightRoute } from '@/models/flight/flightRoute.model'
import { Request, Response, NextFunction } from 'express'
import { Schema } from 'mongoose'
import Stripe from 'stripe'
import { IFlightLeg } from '@/models/flight/flightLeg.model'

interface SearchData {
  departureAirportIATA: string
  arrivalAirportIATA: string

  departureDate: Date
  returnDate: Date | null

  isRoundTrip: boolean

  passengers: {
    [PassengerType.ADULT]: number
    [PassengerType.CHILD]: number
    // infant: number
  }
}

interface FlightsData {
  [FlightType.OUTBOUND]: {
    flight: Schema.Types.ObjectId
    seatClass: SeatClass
  }
  [FlightType.INBOUND]: {
    flight: Schema.Types.ObjectId
    seatClass: SeatClass
  } | null
}
interface PassengersData {
  [PassengerType.ADULT]: [
    {
      lastName: string
      firstName: string
      dateOfBirth: Date
      gender: UserGender
      phoneNumber: string
      email: string
    },
    ...{
      lastName: string
      firstName: string
      dateOfBirth: Date
      gender: UserGender
    }[],
  ]
  [PassengerType.CHILD]: {
    lastName: string
    firstName: string
    dateOfBirth: Date
    gender: UserGender
  }[]
}
interface SeatsData {
  [FlightType.OUTBOUND]: {
    [FlightLegType.DEPARTURE]: {
      [PassengerType.ADULT]: Schema.Types.ObjectId[]
      [PassengerType.CHILD]: Schema.Types.ObjectId[]
    }
    [FlightLegType.TRANSIT]: {
      [PassengerType.ADULT]: Schema.Types.ObjectId[]
      [PassengerType.CHILD]: Schema.Types.ObjectId[]
    }
  }
  [FlightType.INBOUND]: {
    [FlightLegType.DEPARTURE]: {
      [PassengerType.ADULT]: Schema.Types.ObjectId[]
      [PassengerType.CHILD]: Schema.Types.ObjectId[]
    }
    [FlightLegType.TRANSIT]: {
      [PassengerType.ADULT]: Schema.Types.ObjectId[]
      [PassengerType.CHILD]: Schema.Types.ObjectId[]
    }
  }
}
interface BookingData {
  searchData: SearchData
  flightsData: FlightsData
  passengersData: PassengersData
  seatsData: SeatsData
}

export default {
  // create temp order that have payment status is pending
  createTempBooking: async (req: Request, res: Response, next: NextFunction) => {
    const bookingData: BookingData = req.body

    //create passengers
    const adultsPassengersData = bookingData.passengersData[PassengerType.ADULT]
    const childrenPassengersData = bookingData.passengersData[PassengerType.CHILD] || []

    const adultsPassengers = await Promise.all(
      adultsPassengersData.map((passenger) => Passenger.create({ ...passenger, type: PassengerType.ADULT })),
    )
    const childrenPassengers = await Promise.all(
      childrenPassengersData.map((passenger) => Passenger.create({ ...passenger, type: PassengerType.CHILD })),
    )

    const passengers = [...adultsPassengers, ...childrenPassengers]
    const totalPassengers = passengers.length

    //create booking

    const booking = new Booking({
      adults: bookingData.searchData.passengers[PassengerType.ADULT],
      children: bookingData.searchData.passengers[PassengerType.CHILD],
      isRoundtrip: bookingData.searchData.isRoundTrip,
      // totalPrice: 999_999_999,
      // user: null,
      passengers: passengers,
      flightsInfo: {
        [FlightType.OUTBOUND]: null,
        [FlightType.INBOUND]: null,
      },
      paymentStatus: PaymentStatus.PENDING,
    })

    //create reservations

    const outboundDepartureSeatsData = [
      ...bookingData.seatsData[FlightType.OUTBOUND][FlightLegType.DEPARTURE][PassengerType.ADULT],
      ...bookingData.seatsData[FlightType.OUTBOUND][FlightLegType.DEPARTURE][PassengerType.CHILD],
    ]

    const outboundTransitSeatsData = [
      ...bookingData.seatsData[FlightType.OUTBOUND][FlightLegType.TRANSIT][PassengerType.ADULT],
      ...bookingData.seatsData[FlightType.OUTBOUND][FlightLegType.TRANSIT][PassengerType.CHILD],
    ]

    const inboundDepartureSeatsData = [
      ...bookingData.seatsData[FlightType.INBOUND][FlightLegType.DEPARTURE][PassengerType.ADULT],
      ...bookingData.seatsData[FlightType.INBOUND][FlightLegType.DEPARTURE][PassengerType.CHILD],
    ]

    const inboundTransitSeatsData = [
      ...bookingData.seatsData[FlightType.INBOUND][FlightLegType.TRANSIT][PassengerType.ADULT],
      ...bookingData.seatsData[FlightType.INBOUND][FlightLegType.TRANSIT][PassengerType.CHILD],
    ]

    const outboundDepartureSeats = await Promise.all(outboundDepartureSeatsData.map((seat) => Seat.findById(seat)))
    const outboundTransitSeats = await Promise.all(outboundTransitSeatsData.map((seat) => Seat.findById(seat)))
    const inboundDepartureSeats = await Promise.all(inboundDepartureSeatsData.map((seat) => Seat.findById(seat)))
    const inboundTransitSeats = await Promise.all(inboundTransitSeatsData.map((seat) => Seat.findById(seat)))

    // const outboundFlight = await Flight.findById(bookingData.flightsData[FlightType.OUTBOUND].flight).populate(
    //   'flightRoute',
    // )

    const outboundFlightId = bookingData.flightsData[FlightType.OUTBOUND]!.flight
    const outboundFlightSeatClass = bookingData.flightsData[FlightType.OUTBOUND]!.seatClass

    const outboundFlight = await Flight.findById(outboundFlightId).populate<{
      flightRoute: IFlightRoute
      flightLegs: {
        [FlightLegType.DEPARTURE]: { flightRoute: IFlightRoute }
        [FlightLegType.TRANSIT]: { flightRoute: IFlightRoute }
      }
    }>([
      { path: 'flightRoute' },
      {
        path: 'flightLegs',
        populate: [
          { path: FlightLegType.DEPARTURE, populate: { path: 'flightRoute' } },
          { path: FlightLegType.TRANSIT, populate: { path: 'flightRoute' } },
        ],
      },
    ])

    // console.log(outboundFlight?.flightLegs?.[FlightLegType.DEPARTURE].)

    if (!outboundFlight) {
      return res.json({
        status: 'error',
        message: 'Flight not found',
      })
    }

    const outboundDepartureFlightReservations = await Promise.all(
      passengers.map((passenger, index) =>
        Reservation.create({
          flightLeg: outboundFlight?.flightLegs?.[FlightLegType.DEPARTURE],
          passenger: passenger,
          seat: outboundDepartureSeats[index],
          paymentStatus: PaymentStatus.PENDING,
        }),
      ),
    )
    let outboundPrice = outboundFlight.flightLegs[FlightLegType.DEPARTURE].flightRoute.prices[outboundFlightSeatClass]

    let outboundTransitFlightReservations: IReservation[] = []
    if (outboundFlight?.hasTransit) {
      outboundTransitFlightReservations = await Promise.all(
        passengers.map((passenger, index) =>
          Reservation.create({
            flightLeg: outboundFlight?.flightLegs?.[FlightLegType.TRANSIT],
            passenger: passenger,
            seat: outboundTransitSeats[index],
            paymentStatus: PaymentStatus.PENDING,
          }),
        ),
      )
      outboundPrice += outboundFlight.flightLegs[FlightLegType.TRANSIT].flightRoute.prices[outboundFlightSeatClass]
    }

    const totalOutboundPrice = outboundPrice * totalPassengers
    booking.flightsInfo[FlightType.OUTBOUND] = {
      flight: outboundFlight._id,
      seatClass: outboundFlightSeatClass,
      price: outboundPrice,
      reservations: {
        [FlightLegType.DEPARTURE]: outboundDepartureFlightReservations.map((reservation) => reservation._id),
        [FlightLegType.TRANSIT]: outboundTransitFlightReservations.map((reservation) => reservation._id),
      },
    }

    let totalInboundPrice = 0
    if (bookingData.searchData.isRoundTrip) {
      const inboundFlightId = bookingData.flightsData[FlightType.INBOUND]!.flight
      const inboundFlightSeatClass = bookingData.flightsData[FlightType.INBOUND]!.seatClass

      const inboundFlight = await Flight.findById(inboundFlightId).populate<{
        flightRoute: IFlightRoute
        flightLegs: {
          [FlightLegType.DEPARTURE]: { flightRoute: IFlightRoute }
          [FlightLegType.TRANSIT]: { flightRoute: IFlightRoute }
        }
      }>([
        { path: 'flightRoute' },
        { path: 'flightLegs', populate: { path: FlightLegType.DEPARTURE, populate: { path: 'flightRoute' } } },
      ])

      if (!inboundFlight) {
        return res.json({
          status: 'error',
          message: 'Flight not found',
        })
      }

      const inboundDepartureFlightReservations = await Promise.all(
        passengers.map((passenger, index) =>
          Reservation.create({
            flightLeg: inboundFlight?.flightLegs?.[FlightLegType.DEPARTURE],
            passenger: passenger,
            seat: inboundDepartureSeats[index],
            paymentStatus: PaymentStatus.PENDING,
          }),
        ),
      )
      let inboundPrice = inboundFlight.flightLegs[FlightLegType.DEPARTURE].flightRoute.prices[inboundFlightSeatClass]

      let inboundTransitFlightReservations: IReservation[] = []
      if (inboundFlight?.hasTransit) {
        inboundTransitFlightReservations = await Promise.all(
          passengers.map((passenger, index) =>
            Reservation.create({
              flightLeg: inboundFlight?.flightLegs?.[FlightLegType.TRANSIT],
              passenger: passenger,
              seat: inboundTransitSeats[index],
              paymentStatus: PaymentStatus.PENDING,
            }),
          ),
        )
        inboundPrice += inboundFlight.flightLegs[FlightLegType.TRANSIT].flightRoute.prices[inboundFlightSeatClass]
      }

      totalInboundPrice = inboundPrice * totalPassengers
      booking.flightsInfo[FlightType.INBOUND] = {
        flight: inboundFlight._id,
        seatClass: inboundFlightSeatClass,
        price: inboundPrice,
        reservations: {
          [FlightLegType.DEPARTURE]: inboundDepartureFlightReservations.map((reservation) => reservation._id),
          [FlightLegType.TRANSIT]: inboundTransitFlightReservations.map((reservation) => reservation._id),
        },
      }
    }

    booking.totalPrice = totalOutboundPrice + totalInboundPrice

    // console.log('[log] booking', booking)

    await booking.save()

    return res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    })
  },
}
