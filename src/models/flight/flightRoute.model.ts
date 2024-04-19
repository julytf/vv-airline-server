import { TicketClass, TicketType } from '@/enums/ticket.enums'
import { Schema, Types, model } from 'mongoose'

export interface IFlightRoute {
  distance?: number
  prices: {
    [TicketClass.ECONOMY]: {
      [TicketType.BUDGET]: number | null
      [TicketType.STANDARD]: number | null
      [TicketType.FLEXIBLE]: number | null
    }
    [TicketClass.BUSINESS]: {
      [TicketType.BUDGET]: number | null
      [TicketType.STANDARD]: number | null
      [TicketType.FLEXIBLE]: number | null
    }
  }
  departureAirport: Types.ObjectId
  arrivalAirport: Types.ObjectId
}

export interface IPrice {
  value: number
  ticketClass: TicketClass
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
    type: {
      [TicketClass.ECONOMY]: {
        [TicketType.BUDGET]: Number,
        [TicketType.STANDARD]: Number,
        [TicketType.FLEXIBLE]: Number,
      },
      [TicketClass.BUSINESS]: {
        [TicketType.BUDGET]: Number,
        [TicketType.STANDARD]: Number,
        [TicketType.FLEXIBLE]: Number,
      },
    },
  },
})

flightRouteSchema.pre('find', async function (next) {
  this.populate([{ path: 'departureAirport' }, { path: 'arrivalAirport' }])
  next()
})

const FlightRoute = model<IFlightRoute>('FlightRoute', flightRouteSchema)

export default FlightRoute
