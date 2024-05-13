import FlightRoute, { IFlightRoute } from '@/models/flight/flightRoute.model'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { TicketClass } from '@/enums/ticket.enums'
import { Schema, Types, model } from 'mongoose'
import FlightLeg, { IFlightLeg } from './flightLeg.model'
import { minNotNull } from '@/utils/helpers'

export interface IFlight {
  hasTransit: boolean
  departureTime: Date
  arrivalTime: Date
  remainingSeats: {
    [TicketClass.ECONOMY]: number
    [TicketClass.BUSINESS]: number
  }
  flightRoute: Types.ObjectId
  flightLegs: {
    [FlightLegType.DEPARTURE]: Types.ObjectId
    [FlightLegType.TRANSIT]: Types.ObjectId
  }

  autoFillDataWithFlightLegsData(): Promise<void>
  updateRemainingSeats(): Promise<void>
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
    [TicketClass.ECONOMY]: { type: Number },
    [TicketClass.BUSINESS]: { type: Number },
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

flightSchema.methods.updateRemainingSeats = async function () {
  const flight = this
  const departureFlightLeg = await FlightLeg.findById<IFlightLeg>(flight.flightLegs[FlightLegType.DEPARTURE])
  const transitFlightLeg = await FlightLeg.findById<IFlightLeg>(flight.flightLegs[FlightLegType.TRANSIT])

  flight.remainingSeats = {
    [TicketClass.ECONOMY]: minNotNull(
      departureFlightLeg?.remainingSeats[TicketClass.ECONOMY] ?? null,
      transitFlightLeg?.remainingSeats[TicketClass.ECONOMY] ?? null,
    ),
    [TicketClass.BUSINESS]: minNotNull(
      departureFlightLeg?.remainingSeats[TicketClass.BUSINESS] ?? null,
      transitFlightLeg?.remainingSeats[TicketClass.BUSINESS] ?? null,
    ),
  }
}

flightSchema.method('autoFillDataWithFlightLegsData', async function () {
  const flight = this

  const departureFlightLeg = Boolean(flight.flightLegs[FlightLegType.DEPARTURE])
    ? await FlightLeg.findById<
        IFlightLeg & {
          flightRoute: IFlightRoute
        }
      >(flight.flightLegs[FlightLegType.DEPARTURE])
    : null

  if (!departureFlightLeg) {
    throw new Error('FlightLeg not found')
  }

  const transitFlightLeg = Boolean(flight.flightLegs[FlightLegType.TRANSIT])
    ? await FlightLeg.findById<
        IFlightLeg & {
          flightRoute: IFlightRoute
        }
      >(flight.flightLegs[FlightLegType.TRANSIT])
    : null

  const flightRoute = await FlightRoute.findOne({
    departureAirport: departureFlightLeg?.flightRoute.departureAirport,
    arrivalAirport: transitFlightLeg?.flightRoute.arrivalAirport ?? departureFlightLeg?.flightRoute.arrivalAirport,
  })
  console.log('departureFlightLeg?.flightRoute.departureAirport', departureFlightLeg?.flightRoute.departureAirport)
  console.log('transitFlightLeg?.flightRoute.arrivalAirport', transitFlightLeg?.flightRoute.arrivalAirport)
  console.log('departureFlightLeg?.flightRoute.arrivalAirport', departureFlightLeg?.flightRoute.arrivalAirport)

  if (!flightRoute) {
    throw new Error('FlightRoute not found')
  }

  flight.flightRoute = flightRoute._id
  flight.departureTime = departureFlightLeg?.departureTime
  flight.arrivalTime = transitFlightLeg?.arrivalTime ?? departureFlightLeg?.arrivalTime
  flight.remainingSeats = {
    [TicketClass.ECONOMY]: minNotNull(
      departureFlightLeg?.remainingSeats[TicketClass.ECONOMY] || null,
      transitFlightLeg?.remainingSeats[TicketClass.ECONOMY] || null,
    ),
    [TicketClass.BUSINESS]: minNotNull(
      departureFlightLeg?.remainingSeats[TicketClass.BUSINESS] || null,
      transitFlightLeg?.remainingSeats[TicketClass.BUSINESS] || null,
    ),
  }
})

flightSchema.pre('find', async function (next) {
  this.populate([{ path: 'flightRoute' }, { path: 'flightLegs.DEPARTURE' }, { path: 'flightLegs.TRANSIT' }])
  next()
})

const Flight = model<IFlight>('Flight', flightSchema)

export default Flight
