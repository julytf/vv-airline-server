import { FlightLegStatus } from '@/enums/flightLeg.enums'
import { SeatClass } from '@/enums/seat.enums'
import { Schema, Types, model } from 'mongoose'

export interface IFlightLeg {
  departureTime: Date
  arrivalTime: Date
  remainingSeats: {
    [SeatClass.ECONOMY]: number
    [SeatClass.BUSINESS]: number
  }
  status: FlightLegStatus
  flightRoute: Types.ObjectId
  aircraft: Types.ObjectId
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
    [SeatClass.ECONOMY]: { type: Number },
    [SeatClass.BUSINESS]: { type: Number },
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

// TODO:
flightLegSchema.methods.updateRemainingSeats = async function () {
  const flight = this
}

flightLegSchema.pre('find', async function (next) {
  this.populate([{ path: 'flightRoute' }, { path: 'aircraft' }])
  next()
})

const FlightLeg = model<IFlightLeg>('FlightLeg', flightLegSchema)

export default FlightLeg
