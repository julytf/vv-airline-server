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
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import AppError from '@/errors/AppError'
import NotFoundError from '@/errors/NotFoundError'

const stripe = new Stripe(config.stripe.secretKey)

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
    ticketClass: TicketClass
  }
  [FlightType.INBOUND]: {
    flight: Schema.Types.ObjectId
    ticketClass: TicketClass
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

  // getCheckoutSession: catchPromise(async function (req: IRequestWithUser, res, next) {
  //   const bookingId = req.params.bookingId

  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     success_url: `${req.protocol}://${req.hostname}:${process.env.PORT}/api/payment/success/${bookingId}`,
  //     cancel_url: `${req.protocol}://${req.hostname}:${process.env.PORT}/api/payment/fail/${bookingId}`,
  //     // return_url: `${req.protocol}://${req.hostname}:${process.env.PORT}/api/payment/fail/${bookingId}`,
  //     customer_email: req?.user?.email,
  //     mode: 'payment',
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: 'usd',
  //           product_data: {
  //             name: 'Flight booking',
  //           },
  //           unit_amount: 10000,
  //         },
  //         quantity: 1,
  //       },
  //     ],
  //     metadata: {
  //       bookingId: bookingId,
  //     },
  //   })

  //   const paymentUrl = session.url

  //   res.status(200).json({
  //     status: 'success',
  //     paymentUrl,
  //     test: { session },
  //   })
  // }),

  getPaymentIntents: async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.query.bookingId as string
    if (!bookingId) return next(new AppError('Booking id is required', 400))

    const booking = await Booking.findById(bookingId)
    console.log(bookingId)
    console.log(booking)

    if (!booking) {
      return next(new NotFoundError('Booking not found'))
    }
    console.log(booking)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice,
      currency: 'vnd',
      payment_method_types: ['card'],
      metadata: { bookingId: bookingId },
    })

    booking.payment.method = PaymentMethod.CARD
    booking.payment.intentId = paymentIntent.id

    await booking.save()

    return res.json({
      status: 'success',
      data: { paymentIntent },
    })
  },

  // TODO: get confirm request from user instead of directly from paypal webhook because  we doesn't have a public host yet
  // confirmPayment: async (req: Request, res: Response, next: NextFunction) => {
  //   const paid = true

  //   if (!paid) {
  //     return res.json({
  //       status: 'error',
  //       message: 'Payment failed',
  //     })
  //   }

  //   // TODO: get bookingId from paypal webhook
  //   const bookingId = req.body.bookingId

  //   const booking = await Booking.findById(bookingId)

  //   if (!booking) {
  //     return res.json({
  //       status: 'error',
  //       message: 'Booking not found',
  //     })
  //   }

  //   booking.paymentStatus = PaymentStatus.SUCCEEDED
  //   booking.paymentMethod = PaymentMethod.PAYPAL

  //   await booking.save()
  // },

  paymentSuccess: catchPromise(async function (req, res, next) {
    const bookingId = req.query.bookingId as string

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return next(new NotFoundError('Booking not found'))
    }
    if (!booking?.payment?.intentId) {
      return next(new AppError('Booking has no payment intent', 400))
    }

    // const paymentSession = await stripe.checkout.sessions.retrieve(booking.payment.intentId)
    // console.log(paymentSession)
    // console.log(paymentSession.payment_status)

    const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment.intentId)
    console.log(paymentIntent)
    console.log(paymentIntent.status)

    if (paymentIntent.status !== 'succeeded') {
      return next(new AppError('Payment failed', 400))
    }

    // booking.payment.status = PaymentStatus.SUCCEEDED
    // await booking.updatePaymentStatus(PaymentStatus.SUCCEEDED)
    booking.payment.status = PaymentStatus.SUCCEEDED
    await booking.save()

    // update reservation paymentStatus
    const reservations = [
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations[FlightLegType.DEPARTURE].map(
        (reservation) => reservation.reservation,
      ),
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations[FlightLegType.TRANSIT].map(
        (reservation) => reservation.reservation,
      ),
    ]
    await Promise.all(
      reservations.map(async (reservation) => {
        console.log('log', reservation, PaymentStatus.SUCCEEDED)
        await Reservation.findByIdAndUpdate(reservation._id, { paymentStatus: PaymentStatus.SUCCEEDED })
      }),
    )

    // TODO:
    // update flights and flightLegs seats
    // const outboundFlight = await Flight.findById(booking.flightsInfo[FlightType.OUTBOUND].flight)
    // if (!outboundFlight) {
    //   return next(new NotFoundError('Outbound flight not found'))
    // }



    res.status(200).json({
      status: 'success',
    })
  }),
}
