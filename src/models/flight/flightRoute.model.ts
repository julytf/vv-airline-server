import { SeatClasses } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface IFlightRoute {
  distance?: number
  prices: IPrice[]
  departureAirport: Schema.Types.ObjectId
  destinationAirport: Schema.Types.ObjectId
}

export interface IPrice {
  value: number
  seatClass: SeatClasses
}

const flightRouteSchema = new Schema<IFlightRoute>({
  distance: {
    type: Number,
  },
  departureAirport: {
    type: Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
  },
  destinationAirport: {
    type: Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
  },
  prices: [
    {
      value: {
        type: Number,
        required: true,
      },
      seatClass: {
        type: String,
        enum: SeatClasses,
        required: true,
        default: SeatClasses.ECONOMY,
      },
    },
  ],
})

const reservation = model<IFlightRoute>('reservation', flightRouteSchema)

export default reservation
