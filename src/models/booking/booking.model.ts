import { FlightType } from '@/enums/flight.enums'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enums'
import { SeatClass } from '@/enums/seat.enums'
import { Schema, Types, model } from 'mongoose'

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
        [FlightLegType.DEPARTURE]: Types.ObjectId[]
        [FlightLegType.TRANSIT]: Types.ObjectId[]
      }
    }
    [FlightType.INBOUND]?: {
      flight: Types.ObjectId
      seatClass: SeatClass
      price: number
      reservations: {
        [FlightLegType.DEPARTURE]: Types.ObjectId[]
        [FlightLegType.TRANSIT]: Types.ObjectId[]
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
              type: Schema.Types.ObjectId,
              ref: 'Reservation',
            },
          ],
          [FlightLegType.TRANSIT]: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Reservation',
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
              type: Schema.Types.ObjectId,
              ref: 'Reservation',
            },
          ],
          [FlightLegType.TRANSIT]: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Reservation',
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

const Booking = model<IBooking>('Booking', bookingSchema)

export default Booking
