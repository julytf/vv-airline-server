import { SeatClass } from '@/enums/seat.enums'
import { Schema, Types, model } from 'mongoose'

export interface IFlightRoute {
  distance?: number
  prices: {
    [SeatClass.ECONOMY]: number
    [SeatClass.BUSINESS]: number
  }
  departureAirport: Types.ObjectId
  arrivalAirport: Types.ObjectId
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
    [SeatClass.ECONOMY]: { type: Number },
    [SeatClass.BUSINESS]: { type: Number },
  },
})

flightRouteSchema.pre('find', async function (next) {
  this.populate([{ path: 'departureAirport' }, { path: 'arrivalAirport' }])
  next()
})

const FlightRoute = model<IFlightRoute>('FlightRoute', flightRouteSchema)

export default FlightRoute
