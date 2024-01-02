import { Schema, model } from 'mongoose'

export interface IFlight {
  hasTransit: boolean
  departureTime: Date
  arrivalTime: Date
  remainingSeats?: number
  flightRoute: Schema.Types.ObjectId
  flightLegs: Schema.Types.ObjectId[]
}

const flightSchema = new Schema<IFlight>({
  hasTransit: {
    type: Boolean,
    default: false,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  remainingSeats: {
    type: Number,
    required: true,
    default: 0,
  },
  flightRoute: {
    type: Schema.Types.ObjectId,
    ref: 'FlightRoute',
  },
  flightLegs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FlightLeg',
    },
  ],
})

const Flight = model<IFlight>('Flight', flightSchema)

export default Flight
