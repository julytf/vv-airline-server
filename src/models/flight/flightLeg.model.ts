import { flightLegStatus } from '@/enums/flightLeg.enums'
import { Schema, model } from 'mongoose'

export interface IFlightLeg {
  departureTime: Date
  arrivalTime: Date
  remainingSeats: number
  status: flightLegStatus
  flightRoute: Schema.Types.ObjectId
}

const flightLegSchema = new Schema<IFlightLeg>({
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
  status: {
    type: String,
    enum: flightLegStatus,
    default: flightLegStatus.AVAILABLE,
  },
  flightRoute: {
    type: Schema.Types.ObjectId,
    ref: 'FlightRoute',
  },
})

const FlightLeg = model<IFlightLeg>('FlightLeg', flightLegSchema)

export default FlightLeg
