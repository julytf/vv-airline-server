import { FlightLegStatus } from '@/enums/flightLeg.enums'
import { TicketClass } from '@/enums/ticket.enums'
import { PreMiddlewareFunction, Schema, Types, model } from 'mongoose'

export interface IFlightLeg {
  departureTime: Date
  arrivalTime: Date
  remainingSeats: {
    [TicketClass.ECONOMY]: number
    [TicketClass.BUSINESS]: number
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
    [TicketClass.ECONOMY]: { type: Number },
    [TicketClass.BUSINESS]: { type: Number },
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

const findMiddleware: PreMiddlewareFunction = async function (next) {
  this.populate([{ path: 'flightRoute' }, { path: 'aircraft' }])
  next()
}

flightLegSchema.pre(/find/, findMiddleware)

const FlightLeg = model<IFlightLeg>('FlightLeg', flightLegSchema)

export default FlightLeg
