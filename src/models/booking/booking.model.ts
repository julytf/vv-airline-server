import { FlightType } from '@/enums/flight.enums'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enums'
import { SeatClass } from '@/enums/seat.enums'
import { model, PreMiddlewareFunction, Schema, Types } from 'mongoose'
import Reservation from './reservation.model'

export interface IBooking {
  adults: number
  children: number
  isRoundtrip: boolean
  totalPrice: number
  user?: Types.ObjectId
  passengers: Types.ObjectId[]
  flightsInfo: {
    [FlightType.OUTBOUND]: {
      flight: Types.ObjectId
      seatClass: SeatClass
      price: number
      reservations: {
        [FlightLegType.DEPARTURE]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
        [FlightLegType.TRANSIT]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
      }
    }
    [FlightType.INBOUND]?: {
      flight: Types.ObjectId
      seatClass: SeatClass
      price: number
      reservations: {
        [FlightLegType.DEPARTURE]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
        [FlightLegType.TRANSIT]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
      }
    }
  }
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
}

const bookingSchema = new Schema<IBooking>({
  adults: {
    type: Number,
    required: true,
    default: 1,
  },
  children: {
    type: Number,
    required: true,
    default: 0,
  },
  isRoundtrip: {
    type: Boolean,
    required: true,
    default: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  passengers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
    },
  ],
  flightsInfo: {
    [FlightType.OUTBOUND]: {
      type: {
        flight: {
          type: Schema.Types.ObjectId,
          ref: 'Flight',
          required: true,
        },
        seatClass: {
          type: String,
          enum: SeatClass,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        reservations: {
          [FlightLegType.DEPARTURE]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
          [FlightLegType.TRANSIT]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
        },
      },
      default: null,
    },
    [FlightType.INBOUND]: {
      type: {
        flight: {
          type: Schema.Types.ObjectId,
          ref: 'Flight',
          required: true,
        },
        seatClass: {
          type: String,
          enum: SeatClass,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        reservations: {
          [FlightLegType.DEPARTURE]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
          [FlightLegType.TRANSIT]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
        },
      },
      default: null,
    },
  },
  paymentMethod: {
    type: String,
    enum: PaymentMethod,
  },
  paymentStatus: {
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  },
})

const findMiddleware: PreMiddlewareFunction = function (next) {
  this.populate('user')
    .populate('passengers')
    .populate('flightsInfo.OUTBOUND.flight')
    .populate('flightsInfo.OUTBOUND.reservations.DEPARTURE.reservation')
    .populate('flightsInfo.OUTBOUND.reservations.TRANSIT.reservation')
    .populate('flightsInfo.INBOUND.flight')
    .populate('flightsInfo.INBOUND.reservations.DEPARTURE.reservation')
    .populate('flightsInfo.INBOUND.reservations.TRANSIT.reservation')
  next()
}

bookingSchema.pre(/^find/, findMiddleware)

const Booking = model<IBooking>('Booking', bookingSchema)

export default Booking
