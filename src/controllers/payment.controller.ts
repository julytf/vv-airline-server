import { populate } from 'dotenv'
import config from '@/config'
import { FlightType } from '@/enums/flight.enums'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { PassengerType } from '@/enums/passenger.enums'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enums'
import { TicketClass } from '@/enums/ticket.enums'
import { UserGender } from '@/enums/user.enums'
import Seat, { ISeat } from '@/models/aircraft/seat.model'
import Booking, { IBooking } from '@/models/booking/booking.model'
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
import Surcharge from '@/models/flight/surcharge.model'

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

interface RefundData {
  pnr: string
  email: string
  [FlightType.OUTBOUND]: boolean[]
  [FlightType.INBOUND]: boolean[]
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

  // !TODO: get confirm request from user instead of directly from paypal webhook because  we doesn't have a public host yet => wont do this in this project
  // confirmPayment: async (req: Request, res: Response, next: NextFunction) => {
  //   const paid = true

  //   if (!paid) {
  //     return res.json({
  //       status: 'error',
  //       message: 'Payment failed',
  //     })
  //   }

  //   // !TODO: get bookingId from paypal webhook
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

    const bookingReservations = [
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations,
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations,
    ]
    bookingReservations.map((reservation) => {
      reservation.paymentStatus = PaymentStatus.SUCCEEDED
    })

    await booking.save()

    // update reservation paymentStatus
    const reservationDocuments = [
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations.map(
        (reservation) => reservation[FlightLegType.DEPARTURE].reservation,
      ),
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations.map(
        (reservation) => reservation[FlightLegType.TRANSIT].reservation,
      ),
    ]
    await Promise.all(
      reservationDocuments.map(async (reservation) => {
        console.log('log', reservation, PaymentStatus.SUCCEEDED)
        // !TODO: this array have some null value for some reason, fix later => wont fix this in this project
        if (!reservation) return
        await Reservation.findByIdAndUpdate(reservation, { paymentStatus: PaymentStatus.SUCCEEDED })
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
      data: { booking },
    })
  }),

  refund: catchPromise(async function (req: IRequestWithUser, res: Response, next: NextFunction) {
    const bookingId = req.params.id as string
    const { pnr, email } = req.body as RefundData

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return next(new NotFoundError('Booking not found'))
    }
    if (booking.pnr !== pnr || booking.contactInfo.email !== email) {
      return next(new AppError('Invalid pnr or email', 400))
    }

    const refundData = req.body as RefundData

    const outboundRefundQuantity = refundData[FlightType.OUTBOUND].filter((refund) => refund).length
    const inboundRefundQuantity = refundData[FlightType.INBOUND].filter((refund) => refund).length

    const outboundRefundReservations = booking.flightsInfo[FlightType.OUTBOUND].reservations.filter(
      (_, i) => refundData[FlightType.OUTBOUND][i],
    )
    const inboundRefundReservations =
      booking.flightsInfo[FlightType.INBOUND]?.reservations.filter((_, i) => refundData[FlightType.INBOUND][i]) || []

    const refundReservations = [...outboundRefundReservations, ...inboundRefundReservations]

    const subChargeRefundAmount = refundReservations.reduce(
      (acc, reservation) =>
        acc +
        (reservation[FlightLegType.DEPARTURE].services.seat.charge || 0) +
        (reservation[FlightLegType.DEPARTURE].services.baggage.charge || 0) +
        (reservation[FlightLegType.DEPARTURE].services.meal.charge || 0) +
        (reservation[FlightLegType.TRANSIT].services.seat.charge || 0) +
        (reservation[FlightLegType.TRANSIT].services.baggage.charge || 0) +
        (reservation[FlightLegType.TRANSIT].services.meal.charge || 0),
      0,
    )

    const surcharges = await Surcharge.find({})

    const outboundRefundChargeForOne =
      surcharges.find(
        (s) =>
          s.name ===
          `TicketClass.${booking.flightsInfo[FlightType.OUTBOUND].ticketClass}.${
            booking.flightsInfo[FlightType.OUTBOUND].ticketType
          }.Refund`,
      )?.value || 0

    const inboundRefundChargeForOne =
      surcharges.find(
        (s) =>
          s.name ===
          `TicketClass.${booking.flightsInfo?.[FlightType.INBOUND]?.ticketClass}.${booking.flightsInfo?.[
            FlightType.INBOUND
          ]?.ticketType}.Refund`,
      )?.value || 0

    console.log('outboundRefundChargeForOne', outboundRefundChargeForOne)
    console.log('inboundRefundChargeForOne', inboundRefundChargeForOne)

    const refundFee =
      outboundRefundChargeForOne * outboundRefundQuantity + inboundRefundQuantity * inboundRefundChargeForOne
    // console.log(
    //   'booking.flightsInfo[FlightType.OUTBOUND].price * outboundRefundQuantity',
    //   booking.flightsInfo[FlightType.OUTBOUND].price * outboundRefundQuantity,
    // )
    // console.log(
    //   '(booking.flightsInfo?.[FlightType.INBOUND]?.price || 0) * inboundRefundQuantity',
    //   (booking.flightsInfo?.[FlightType.INBOUND]?.price || 0) * inboundRefundQuantity,
    // )
    console.log('subChargeRefundAmount', subChargeRefundAmount)
    console.log('refundFee', refundFee)

    const refundAmount =
      booking.flightsInfo[FlightType.OUTBOUND].price * outboundRefundQuantity +
      (booking.flightsInfo?.[FlightType.INBOUND]?.price || 0) * inboundRefundQuantity +
      subChargeRefundAmount -
      refundFee

    console.log('refundAmount', refundAmount)

    // return res.status(200).json({
    //   status: 'success',
    // })

    if (!booking?.payment?.intentId) {
      return next(new AppError('Booking has no payment intent', 400))
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment.intentId)

    if (paymentIntent.status !== 'succeeded') {
      return next(new AppError('Payment failed', 400))
    }

    const refund = await stripe.refunds.create({
      payment_intent: booking.payment.intentId,
      amount: refundAmount,
    })

    booking.payment.status = PaymentStatus.REFUNDED

    await Promise.all([
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations.map(async (reservation, i) => {
        if (refundData[FlightType.OUTBOUND][i]) {
          reservation.paymentStatus = PaymentStatus.REFUNDED
          const reservationId =
            reservation[FlightLegType.DEPARTURE].reservation?._id || reservation[FlightLegType.TRANSIT].reservation?._id
          if (!reservationId) return
          await Reservation.findByIdAndUpdate(reservationId, { paymentStatus: PaymentStatus.REFUNDED })
        }
      }),
      ...(booking.flightsInfo?.[FlightType.INBOUND]?.reservations.map(async (reservation, i) => {
        if (refundData[FlightType.INBOUND][i]) {
          reservation.paymentStatus = PaymentStatus.REFUNDED
          const reservationId =
            reservation[FlightLegType.DEPARTURE].reservation?._id || reservation[FlightLegType.TRANSIT].reservation?._id
          if (!reservationId) return
          await Reservation.findByIdAndUpdate(reservationId, { paymentStatus: PaymentStatus.REFUNDED })
        }
      }) || []),
    ])

    await booking.save()

    res.status(200).json({
      status: 'success',
      data: { booking },
    })
  }),

  paymentSuccessByStaff: catchPromise(async function (req: IRequestWithUser, res, next) {
    const bookingId = req.query.bookingId as string

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return next(new NotFoundError('Booking not found'))
    }

    // bỏ qua check payment
    // if (!booking?.payment?.intentId) {
    //   return next(new AppError('Booking has no payment intent', 400))
    // }

    // const paymentSession = await stripe.checkout.sessions.retrieve(booking.payment.intentId)
    // console.log(paymentSession)
    // console.log(paymentSession.payment_status)

    // bỏ qua check payment
    // const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment.intentId)
    // console.log(paymentIntent)
    // console.log(paymentIntent.status)

    // if (paymentIntent.status !== 'succeeded') {
    //   return next(new AppError('Payment failed', 400))
    // }

    // booking.payment.status = PaymentStatus.SUCCEEDED
    // await booking.updatePaymentStatus(PaymentStatus.SUCCEEDED)
    booking.staff = req.user?._id

    booking.payment.method = PaymentMethod.CASH
    booking.payment.status = PaymentStatus.SUCCEEDED

    const bookingReservations = [
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations,
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations,
    ]
    bookingReservations.map((reservation) => {
      reservation.paymentStatus = PaymentStatus.SUCCEEDED
    })

    await booking.save()

    // update reservation paymentStatus
    const reservationDocuments = [
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations.map(
        (reservation) => reservation[FlightLegType.DEPARTURE].reservation,
      ),
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations.map(
        (reservation) => reservation[FlightLegType.TRANSIT].reservation,
      ),
    ]
    await Promise.all(
      reservationDocuments.map(async (reservation) => {
        console.log('log', reservation, PaymentStatus.SUCCEEDED)
        // !TODO: this array have some null value for some reason, fix later => wont fix this in this project
        if (!reservation) return
        await Reservation.findByIdAndUpdate(reservation, { paymentStatus: PaymentStatus.SUCCEEDED })
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

  refundByStaff: catchPromise(async function (req: Request, res: Response, next: NextFunction) {
    const bookingId = req.params.id as string
    // const { pnr, email } = req.body as RefundData

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return next(new NotFoundError('Booking not found'))
    }
    // if (booking.pnr !== pnr || booking.contactInfo.email !== email) {
    //   return next(new AppError('Invalid pnr or email', 400))
    // }

    const refundData = req.body as RefundData

    const outboundRefundQuantity = refundData[FlightType.OUTBOUND].filter((refund) => refund).length
    const inboundRefundQuantity = refundData[FlightType.INBOUND].filter((refund) => refund).length

    const outboundRefundReservations = booking.flightsInfo[FlightType.OUTBOUND].reservations.filter(
      (_, i) => refundData[FlightType.OUTBOUND][i],
    )
    const inboundRefundReservations =
      booking.flightsInfo[FlightType.INBOUND]?.reservations.filter((_, i) => refundData[FlightType.INBOUND][i]) || []

    const refundReservations = [...outboundRefundReservations, ...inboundRefundReservations]

    const subChargeRefundAmount = refundReservations.reduce(
      (acc, reservation) =>
        acc +
        (reservation[FlightLegType.DEPARTURE].services.seat.charge || 0) +
        (reservation[FlightLegType.DEPARTURE].services.baggage.charge || 0) +
        (reservation[FlightLegType.DEPARTURE].services.meal.charge || 0) +
        (reservation[FlightLegType.TRANSIT].services.seat.charge || 0) +
        (reservation[FlightLegType.TRANSIT].services.baggage.charge || 0) +
        (reservation[FlightLegType.TRANSIT].services.meal.charge || 0),
      0,
    )

    const surcharges = await Surcharge.find({})

    const outboundRefundChargeForOne =
    surcharges.find(
      (s) =>
        s.name ===
        `TicketClass.${booking.flightsInfo[FlightType.OUTBOUND].ticketClass}.${
          booking.flightsInfo[FlightType.OUTBOUND].ticketType
        }.Refund`,
    )?.value || 0

  const inboundRefundChargeForOne =
    surcharges.find(
      (s) =>
        s.name ===
        `TicketClass.${booking.flightsInfo?.[FlightType.INBOUND]?.ticketClass}.${booking.flightsInfo?.[
          FlightType.INBOUND
        ]?.ticketType}.Refund`,
    )?.value || 0

  console.log('outboundRefundChargeForOne', outboundRefundChargeForOne)
  console.log('inboundRefundChargeForOne', inboundRefundChargeForOne)

  const refundFee =
    outboundRefundChargeForOne * outboundRefundQuantity + inboundRefundQuantity * inboundRefundChargeForOne

    // console.log(
    //   'booking.flightsInfo[FlightType.OUTBOUND].price * outboundRefundQuantity',
    //   booking.flightsInfo[FlightType.OUTBOUND].price * outboundRefundQuantity,
    // )
    // console.log(
    //   '(booking.flightsInfo?.[FlightType.INBOUND]?.price || 0) * inboundRefundQuantity',
    //   (booking.flightsInfo?.[FlightType.INBOUND]?.price || 0) * inboundRefundQuantity,
    // )
    // console.log('surchargeRefundAmount', surchargeRefundAmount)
    // console.log('refundFee', refundFee)

    const refundAmount =
      booking.flightsInfo[FlightType.OUTBOUND].price * outboundRefundQuantity +
      (booking.flightsInfo?.[FlightType.INBOUND]?.price || 0) * inboundRefundQuantity +
      subChargeRefundAmount -
      refundFee

    // if (!booking?.payment?.intentId) {
    //   return next(new AppError('Booking has no payment intent', 400))
    // }

    // const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment.intentId)

    // if (paymentIntent.status !== 'succeeded') {
    //   return next(new AppError('Payment failed', 400))
    // }

    // const refund = await stripe.refunds.create({
    //   payment_intent: booking.payment.intentId,
    //   amount: refundAmount,
    // })

    booking.payment.status = PaymentStatus.REFUNDED

    await Promise.all([
      ...booking.flightsInfo[FlightType.OUTBOUND].reservations.map(async (reservation, i) => {
        if (refundData[FlightType.OUTBOUND][i]) {
          reservation.paymentStatus = PaymentStatus.REFUNDED
          const reservationId =
            reservation[FlightLegType.DEPARTURE].reservation?._id || reservation[FlightLegType.TRANSIT].reservation?._id
          if (!reservationId) return
          await Reservation.findByIdAndUpdate(reservationId, { paymentStatus: PaymentStatus.REFUNDED })
        }
      }),
      ...(booking.flightsInfo?.[FlightType.INBOUND]?.reservations.map(async (reservation, i) => {
        if (refundData[FlightType.INBOUND][i]) {
          reservation.paymentStatus = PaymentStatus.REFUNDED
          const reservationId =
            reservation[FlightLegType.DEPARTURE].reservation?._id || reservation[FlightLegType.TRANSIT].reservation?._id
          if (!reservationId) return
          await Reservation.findByIdAndUpdate(reservationId, { paymentStatus: PaymentStatus.REFUNDED })
        }
      }) || []),
    ])

    await booking.save()

    res.status(200).json({
      status: 'success',
      data: { booking, refundAmount },
    })
  }),
}
