import { TicketType } from './../enums/ticket.enums'
import { populate } from 'dotenv'
import config from '@/config'
import { FlightType } from '@/enums/flight.enums'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { PassengerType } from '@/enums/passenger.enums'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enums'
import { TicketClass } from '@/enums/ticket.enums'
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
import Surcharge from '@/models/flight/surcharge.model'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import { generatePNR } from '@/utils/helpers'
import { SeatType } from '@/enums/seat.enums'
import MealPlan from '@/models/flight/mealPlan.model'

interface SearchData {
  departureAirportIATA: string
  arrivalAirportIATA: string

  departureDate: Date
  returnDate: Date | null

  isRoundTrip: boolean

  passengersQuantity: {
    [PassengerType.ADULT]: number
    [PassengerType.CHILD]: number
  }
}

interface FlightsData {
  [FlightType.OUTBOUND]: {
    flight: Schema.Types.ObjectId
    ticketClass: TicketClass
    ticketType: TicketType
  }
  [FlightType.INBOUND]: {
    flight: Schema.Types.ObjectId
    ticketClass: TicketClass
    ticketType: TicketType
  } | null
}
interface PassengersData {
  contactInfo: {
    email: string
    phoneNumber: string
  }
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
      [PassengerType.ADULT]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
      [PassengerType.CHILD]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
    }
    [FlightLegType.TRANSIT]: {
      [PassengerType.ADULT]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
      [PassengerType.CHILD]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
    }
  }
  [FlightType.INBOUND]: {
    [FlightLegType.DEPARTURE]: {
      [PassengerType.ADULT]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
      [PassengerType.CHILD]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
    }
    [FlightLegType.TRANSIT]: {
      [PassengerType.ADULT]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
      [PassengerType.CHILD]: {
        seat: Schema.Types.ObjectId
        services: {
          baggage: {
            quantity: number
            // charge: number
          }
          meal: {
            name: string
            // charge: number
          }
        }
      }[]
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
  createTempBooking: async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const baggagePrice = 500_000
    const surcharges = await Surcharge.find()
    const mealPlans = await MealPlan.find()

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

    // generate new pnr
    let pnr = ''
    let count = 0
    let documentCount = 0
    do {
      count++
      if (count === 5) throw new Error('Cannot generate pnr')

      pnr = generatePNR()
      console.log('pnr', pnr)

      documentCount = await Booking.countDocuments({ pnr })
      console.log('documentCount', documentCount)
      const docs = await Booking.find({ pnr })
      console.log('docs', docs)
    } while (pnr === '' || documentCount > 0)

    //create booking
    console.log('req.user?._id', req.user?._id)
    const booking = new Booking({
      pnr,
      passengersQuantity: {
        [PassengerType.ADULT]: bookingData.searchData.passengersQuantity[PassengerType.ADULT],
        [PassengerType.CHILD]: bookingData.searchData.passengersQuantity[PassengerType.CHILD],
      },
      isRoundtrip: bookingData.searchData.isRoundTrip,
      // totalPrice: 999_999_999,
      user: req.user?._id,
      contactInfo: bookingData.passengersData.contactInfo,
      passengers: passengers,
      flightsInfo: {
        [FlightType.OUTBOUND]: null,
        [FlightType.INBOUND]: null,
      },
      payment: {
        status: PaymentStatus.PENDING,
      },
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

    const outboundDepartureSeats = await Promise.all(outboundDepartureSeatsData.map((seat) => Seat.findById(seat.seat)))
    const outboundTransitSeats = await Promise.all(outboundTransitSeatsData.map((seat) => Seat.findById(seat.seat)))
    const inboundDepartureSeats = await Promise.all(inboundDepartureSeatsData.map((seat) => Seat.findById(seat.seat)))
    const inboundTransitSeats = await Promise.all(inboundTransitSeatsData.map((seat) => Seat.findById(seat.seat)))

    // const outboundFlight = await Flight.findById(bookingData.flightsData[FlightType.OUTBOUND].flight).populate(
    //   'flightRoute',
    // )

    const outboundFlightId = bookingData.flightsData[FlightType.OUTBOUND]!.flight
    const outboundFlightTicketClass = bookingData.flightsData[FlightType.OUTBOUND]!.ticketClass
    const outboundFlightTicketType = bookingData.flightsData[FlightType.OUTBOUND]!.ticketType

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
    let outboundPrice =
      outboundFlight.flightLegs[FlightLegType.DEPARTURE].flightRoute.prices[outboundFlightTicketClass][
        outboundFlightTicketType
      ] || 0

    console.log('outboundPrice', outboundPrice)
    console.log(
      'outboundFlight.flightLegs[FlightLegType.DEPARTURE].flightRoute.prices[outboundFlightTicketClass][outboundFlightTicketType]',
      outboundFlight.flightLegs[FlightLegType.DEPARTURE].flightRoute.prices[outboundFlightTicketClass][
        outboundFlightTicketType
      ],
    )

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
      outboundPrice +=
        outboundFlight.flightLegs[FlightLegType.TRANSIT].flightRoute.prices[outboundFlightTicketClass][
          outboundFlightTicketType
        ] || 0
    }

    const totalOutboundPrice = outboundPrice * totalPassengers

    console.log('totalOutboundPrice', totalOutboundPrice)

    booking.flightsInfo[FlightType.OUTBOUND] = {
      flight: outboundFlight._id,
      ticketClass: outboundFlightTicketClass,
      ticketType: outboundFlightTicketType,
      price: outboundPrice,
      // reservations: {
      //   [FlightLegType.DEPARTURE]: outboundDepartureFlightReservations.map((reservation) => ({
      //     reservation: reservation._id,
      //     surcharge:
      //       surcharges.find(
      //         (surcharge) => surcharge.name === `SeatType.${(reservation.seat as unknown as ISeat).seatType}`,
      //       )?.value || 0,
      //   })),
      //   [FlightLegType.TRANSIT]: outboundTransitFlightReservations.map((reservation) => ({
      //     reservation: reservation._id,
      //     surcharge:
      //       surcharges.find(
      //         (surcharge) => surcharge.name === `SeatType.${(reservation.seat as unknown as ISeat).seatType}`,
      //       )?.value || 0,
      //   })),
      // },
      reservations: new Array(totalPassengers).fill(null).map((_, index) => {
        const outboundDepartureFlightReservation = outboundDepartureFlightReservations[index]
        const outboundTransitFlightReservation = outboundTransitFlightReservations[index]

        return {
          paymentStatus: PaymentStatus.PENDING,
          [FlightLegType.DEPARTURE]: {
            reservation: outboundDepartureFlightReservation._id,
            services: {
              seat: {
                seatType: (outboundDepartureFlightReservation.seat as unknown as ISeat).seatType || SeatType.NORMAL,
                charge:
                  surcharges.find(
                    (surcharge) =>
                      surcharge.name ===
                      `SeatType.${(outboundDepartureFlightReservation.seat as unknown as ISeat).seatType}`,
                  )?.value || 0,
              },
              baggage: {
                quantity: outboundDepartureSeatsData[index].services.baggage.quantity || 0,
                charge: (outboundDepartureSeatsData[index].services.baggage.quantity || 0) * baggagePrice,
              },
              meal: {
                name: outboundDepartureSeatsData[index].services.meal.name,
                charge:
                  mealPlans.find((mealPlan) => mealPlan.name === outboundDepartureSeatsData[index].services.meal.name)
                    ?.value || 0,
              },
            },
          },
          [FlightLegType.TRANSIT]: outboundTransitFlightReservation && {
            reservation: outboundTransitFlightReservation._id,
            services: {
              seat: {
                seatType: (outboundTransitFlightReservation.seat as unknown as ISeat).seatType || SeatType.NORMAL,
                charge:
                  surcharges.find(
                    (surcharge) =>
                      surcharge.name ===
                      `SeatType.${(outboundTransitFlightReservation.seat as unknown as ISeat).seatType}`,
                  )?.value || 0,
              },
              baggage: {
                quantity: outboundTransitSeatsData[index].services.baggage.quantity || 0,
                charge: (outboundTransitSeatsData[index].services.baggage.quantity || 0) * baggagePrice,
              },
              meal: {
                name: outboundTransitSeatsData[index].services.meal.name,
                charge:
                  mealPlans.find((mealPlan) => mealPlan.name === outboundTransitSeatsData[index].services.meal.name)
                    ?.value || 0,
              },
            },
          },
        }
      }),
    }

    let totalInboundPrice = 0
    if (bookingData.searchData.isRoundTrip) {
      const inboundFlightId = bookingData.flightsData[FlightType.INBOUND]!.flight
      const inboundFlightTicketClass = bookingData.flightsData[FlightType.INBOUND]!.ticketClass
      const inboundFlightTicketType = bookingData.flightsData[FlightType.INBOUND]!.ticketType

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
      let inboundPrice =
        inboundFlight.flightLegs[FlightLegType.DEPARTURE].flightRoute.prices[inboundFlightTicketClass][
          inboundFlightTicketType
        ] || 0

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
        inboundPrice +=
          inboundFlight.flightLegs[FlightLegType.TRANSIT].flightRoute.prices[inboundFlightTicketClass][
            inboundFlightTicketType
          ] || 0
      }

      totalInboundPrice = inboundPrice * totalPassengers

      console.log('totalInboundPrice', totalInboundPrice)

      booking.flightsInfo[FlightType.INBOUND] = {
        flight: inboundFlight._id,
        ticketClass: inboundFlightTicketClass,
        ticketType: inboundFlightTicketType,
        price: inboundPrice,
        reservations: new Array(totalPassengers).fill(0).map((_, index) => {
          const inboundDepartureFlightReservation = inboundDepartureFlightReservations[index]
          const inboundTransitFlightReservation = inboundTransitFlightReservations[index]

          return {
            paymentStatus: PaymentStatus.PENDING,
            [FlightLegType.DEPARTURE]: {
              reservation: inboundDepartureFlightReservation._id,
              services: {
                seat: {
                  seatType: (inboundDepartureFlightReservation.seat as unknown as ISeat).seatType || SeatType.NORMAL,
                  charge:
                    surcharges.find(
                      (surcharge) =>
                        surcharge.name ===
                        `SeatType.${(inboundDepartureFlightReservation.seat as unknown as ISeat).seatType}`,
                    )?.value || 0,
                },
                baggage: {
                  quantity: inboundDepartureSeatsData[index].services.baggage.quantity || 0,
                  charge: (inboundDepartureSeatsData[index].services.baggage.quantity || 0) * baggagePrice,
                },
                meal: {
                  name: inboundDepartureSeatsData[index].services.meal.name,
                  charge:
                    mealPlans.find((mealPlan) => mealPlan.name === inboundDepartureSeatsData[index].services.meal.name)
                      ?.value || 0,
                },
              },
            },
            [FlightLegType.TRANSIT]: inboundTransitFlightReservation && {
              reservation: inboundTransitFlightReservation._id,
              services: {
                seat: {
                  seatType: (inboundTransitFlightReservation.seat as unknown as ISeat).seatType || SeatType.NORMAL,
                  charge:
                    surcharges.find(
                      (surcharge) =>
                        surcharge.name ===
                        `SeatType.${(inboundTransitFlightReservation.seat as unknown as ISeat).seatType}`,
                    )?.value || 0,
                },
                baggage: {
                  quantity: inboundTransitSeatsData[index].services.baggage.quantity || 0,
                  charge: (inboundTransitSeatsData[index].services.baggage.quantity || 0) * baggagePrice,
                },
                meal: {
                  name: inboundTransitSeatsData[index].services.meal.name,
                  charge:
                    mealPlans.find((mealPlan) => mealPlan.name === inboundTransitSeatsData[index].services.meal.name)
                      ?.value || 0,
                },
              },
            },
          }
        }),
      }
    }
    console.log(
      'booking?.flightsInfo[FlightType.OUTBOUND].reservations',
      booking?.flightsInfo[FlightType.OUTBOUND].reservations,
    )
    console.log(
      'booking?.flightsInfo[FlightType.INBOUND]?.reservations',
      booking?.flightsInfo[FlightType.INBOUND]?.reservations,
    )

    const totalSubCharge = [
      ...(booking?.flightsInfo[FlightType.OUTBOUND].reservations.map(
        (obj) =>
          (obj[FlightLegType.DEPARTURE]?.services?.seat?.charge || 0) +
          (obj[FlightLegType.DEPARTURE]?.services?.baggage?.charge || 0) +
          (obj[FlightLegType.DEPARTURE]?.services?.meal?.charge || 0),
      ) || []),
      ...(booking?.flightsInfo[FlightType.OUTBOUND].reservations.map(
        (obj) =>
          (obj[FlightLegType.TRANSIT]?.services?.seat?.charge || 0) +
          (obj[FlightLegType.TRANSIT]?.services?.baggage?.charge || 0) +
          (obj[FlightLegType.TRANSIT]?.services?.meal?.charge || 0),
      ) || []),
      ...(booking?.flightsInfo[FlightType.INBOUND]?.reservations.map(
        (obj) =>
          (obj[FlightLegType.DEPARTURE]?.services?.seat?.charge || 0) +
          (obj[FlightLegType.DEPARTURE]?.services?.baggage?.charge || 0) +
          (obj[FlightLegType.DEPARTURE]?.services?.meal?.charge || 0),
      ) || []),
      ...(booking?.flightsInfo[FlightType.INBOUND]?.reservations.map(
        (obj) =>
          (obj[FlightLegType.TRANSIT]?.services?.seat?.charge || 0) +
          (obj[FlightLegType.TRANSIT]?.services?.baggage?.charge || 0) +
          (obj[FlightLegType.TRANSIT]?.services?.meal?.charge || 0),
      ) || []),
    ].reduce((acc, cur) => acc + (cur || 0), 0)

    booking.totalPrice = totalOutboundPrice + totalInboundPrice + totalSubCharge

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
