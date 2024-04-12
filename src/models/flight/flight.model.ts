import { FlightLegType } from '@/enums/flightLeg.enums'
import { SeatClass } from '@/enums/seat.enums'
import { Schema, Types, model } from 'mongoose'

export interface IFlight {
  hasTransit: boolean
  departureTime : Date
  arrivalTime: Date
  remainingSeats: {
    [SeatClass.ECONOMY]: number
    [SeatClass.BUSINESS]: number
  }
  flightRoute: Types.ObjectId
  flightLegs: {
    [FlightLegType.DEPARTURE]: Types.ObjectId
    [FlightLegType.TRANSIT]: Types.ObjectId
  }
}

const flightSchema = new Schema<IFlight>({
  hasTransit: {
    type: Boolean,
    default: false,
  },
  departureTime : {
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
  flightRoute: {
    type: Schema.Types.ObjectId,
    ref: 'FlightRoute',
  },
  flightLegs: {
    [FlightLegType.DEPARTURE]: {
      type: Schema.Types.ObjectId,
      ref: 'FlightLeg',
    },
    [FlightLegType.TRANSIT]: {
      type: Schema.Types.ObjectId,
      ref: 'FlightLeg',
    },
  },
})

// TODO:
flightSchema.methods.updateRemainingSeats = async function () {
  const flight = this
}

flightSchema.pre('find', async function (next) {
  this.populate([{ path: 'flightRoute' }, { path: 'flightLegs.DEPARTURE' }, { path: 'flightLegs.TRANSIT' }])
  next()
})

const Flight = model<IFlight>('Flight', flightSchema)

export default Flight
