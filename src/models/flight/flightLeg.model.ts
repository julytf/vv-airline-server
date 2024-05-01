import { FlightLegStatus } from '@/enums/flightLeg.enums'
import { TicketClass } from '@/enums/ticket.enums'
import { endOfYear, startOfYear } from 'date-fns'
import { PreMiddlewareFunction, Schema, Types, model } from 'mongoose'

export interface IFlightLeg {
  flightNumber: string
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
  flightNumber: {
    type: String,
    // required: true,
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

// Pre-save middleware to generate flight number
const createFlightNumberMiddleware: PreMiddlewareFunction = async function (next) {
  // console.log('here')
  const flightLeg = this

  // Generate flightLeg number only if it's a new document
  if (!flightLeg.isNew) {
    return next()
  }

  const now = new Date()
  const lastFlightLeg = await FlightLeg.findOne({ departureTime: { $gte: startOfYear(now), $lte: endOfYear(now) } })
    .sort({ flightNumber: -1 })
    .exec()

  let sequenceNumber = 1 // Default sequence number if no previous flightLeg found

  if (lastFlightLeg) {
    // Extract the sequence number from the flightLeg number
    const lastFlightNumber = lastFlightLeg.flightNumber
    const lastSequenceNumber = parseInt(lastFlightNumber.slice(-4)) // Assuming the last 4 characters represent the sequence number
    sequenceNumber = lastSequenceNumber + 1
  }

  // Generate flightLeg number in the format VNYYYYNNNN
  const newFlightNumber = `VN${sequenceNumber.toString().padStart(4, '0')}`
  flightLeg.flightNumber = newFlightNumber

  next()
}
flightLegSchema.pre(/(save|create)/, createFlightNumberMiddleware)

const FlightLeg = model<IFlightLeg>('FlightLeg', flightLegSchema)

export default FlightLeg
