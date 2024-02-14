import { SeatClass } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface IFlightRoute {
  distance?: number
  prices: IPrice[]
  departureAirport: Schema.Types.ObjectId
  destinationAirport: Schema.Types.ObjectId
}

export interface IPrice {
  value: number
  seatClass: SeatClass
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
        enum: SeatClass,
        required: true,
        default: SeatClass.ECONOMY,
      },
    },
  ],
})

const FlightRoute = model<IFlightRoute>('FlightRoute', flightRouteSchema)

export default FlightRoute
