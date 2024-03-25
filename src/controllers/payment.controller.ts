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
  //
  // move to paypal
  //
  // intents: async (req: Request, res: Response, next: NextFunction) => {
  //   const amount = 10000

  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount,
  //     currency: 'usd',
  //     payment_method_types: ['card'],
  //     metadata: { uid: 'testuid123' },
  //   })

  //   return res.json({
  //     status: 'success',
  //     data: { paymentIntent },
  //   })
  // },

  // TODO: get confirm request from user instead of directly from paypal webhook because  we doesn't have a public host yet
  confirmPayment: async (req: Request, res: Response, next: NextFunction) => {
    const paid = true

    if (!paid) {
      return res.json({
        status: 'error',
        message: 'Payment failed',
      })
    }

    // TODO: get bookingId from paypal webhook
    const bookingId = req.body.bookingId

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.json({
        status: 'error',
        message: 'Booking not found',
      })
    }

    booking.paymentStatus = PaymentStatus.SUCCEEDED
    booking.paymentMethod = PaymentMethod.PAYPAL

    await booking.save()
  },
}
