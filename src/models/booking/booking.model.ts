import { Schema, model } from 'mongoose'

export interface IBooking {
  adults: number
  children: number
  isRoundtrip: boolean
  totalPrice: number
  user: Schema.Types.ObjectId
  passengers: Schema.Types.ObjectId[]
  flights: Schema.Types.ObjectId[]
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
    required: true,
  },
  passengers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
    },
  ],
  flights: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Flight',
    },
  ],
})

const Booking = model<IBooking>('Booking', bookingSchema)

export default Booking
