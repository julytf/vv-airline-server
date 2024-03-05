import { SeatClass } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface IFlightRoute {
  distance?: number
  prices: {
    [key: string]: number
  }
  departureAirport: Schema.Types.ObjectId
  arrivalAirport: Schema.Types.ObjectId
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
  arrivalAirport: {
    type: Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
  },
  prices: {
    type: Map,
    of: String,
  },
})

const FlightRoute = model<IFlightRoute>('FlightRoute', flightRouteSchema)

export default FlightRoute
