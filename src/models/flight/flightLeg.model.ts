import { FlightLegStatus } from '@/enums/flightLeg.enums'
import { Schema, model } from 'mongoose'

export interface IFlightLeg {
  departureTime: Date
  arrivalTime: Date
  remainingSeats: number
  status: FlightLegStatus
  flightRoute: Schema.Types.ObjectId
  aircraft: Schema.Types.ObjectId
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
    enum: FlightLegStatus,
    default: FlightLegStatus.AVAILABLE,
  },
  flightRoute: {
    type: Schema.Types.ObjectId,
    ref: 'FlightRoute',
  },
  aircraft: {
    type: Schema.Types.ObjectId,
    ref: 'Aircraft',
  },
})

const FlightLeg = model<IFlightLeg>('FlightLeg', flightLegSchema)

export default FlightLeg
