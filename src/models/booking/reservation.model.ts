import { PaymentStatus } from './../../enums/payment.enums'
import { SeatClass } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface IReservation {
  price: number
  // status?: string
  // booking: Schema.Types.ObjectId
  flightLeg: Schema.Types.ObjectId
  passenger: Schema.Types.ObjectId
  seat: Schema.Types.ObjectId
  services: Schema.Types.ObjectId[]
  paymentStatus?: PaymentStatus
}

const reservationSchema = new Schema<IReservation>({
  price: {
    type: Number,
    required: true,
  },
  // status: {
  //   type: String,
  // },
  // booking: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Booking',
  // },
  flightLeg: {
    type: Schema.Types.ObjectId,
    ref: 'FlightLeg',
  },
  passenger: {
    type: Schema.Types.ObjectId,
    ref: 'Passenger',
  },
  seat: {
    type: Schema.Types.ObjectId,
    ref: 'Seat',
  },
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
  ],
  paymentStatus: {
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  },
})

const Reservation = model<IReservation>('reservation', reservationSchema)

export default Reservation
