import { FlightLegStatus } from '@/enums/flightLeg.enums'
import { TicketClass } from '@/enums/ticket.enums'
import { endOfYear, startOfYear } from 'date-fns'
import { PreMiddlewareFunction, Schema, Types, model } from 'mongoose'
import Reservation from '../booking/reservation.model'
import { PaymentStatus } from '@/enums/payment.enums'
import { ISeat } from '../aircraft/seat.model'
import AircraftModel from '../aircraft/aircraftModel.model'

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

  updateRemainingSeats(): Promise<void>
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

// flightLegSchema.methods.updateRemainingSeats = async function ({
//   [TicketClass.ECONOMY]: economySeatsQuantity,
//   [TicketClass.BUSINESS]: businessSeatsQuantity,
// }: {
//   [TicketClass.ECONOMY]: number
//   [TicketClass.BUSINESS]: number
// }) {
//   const flightLeg = this
//   flightLeg.remainingSeats[TicketClass.ECONOMY] = economySeatsQuantity
//   flightLeg.remainingSeats[TicketClass.BUSINESS] = businessSeatsQuantity
// }

flightLegSchema.methods.updateRemainingSeats = async function () {
  const flightLeg = this

  const aircraftModel = await AircraftModel.findById(
    flightLeg.aircraft.aircraftModel?._id || flightLeg.aircraft.aircraftModel,
  )

  const reservations = await Reservation.find<{
    paymentStatus: PaymentStatus
    seat: ISeat
  }>({ flightLeg: flightLeg._id, paymentStatus: PaymentStatus.SUCCEEDED })

  const economySeatsQuantity = reservations.filter(
    (reservation) => reservation.seat.ticketClass === TicketClass.ECONOMY,
  ).length

  const businessSeatsQuantity = reservations.filter(
    (reservation) => reservation.seat.ticketClass === TicketClass.BUSINESS,
  ).length

  flightLeg.remainingSeats = {
    [TicketClass.ECONOMY]: (aircraftModel?.seatQuantity?.[TicketClass.ECONOMY] || 0) - economySeatsQuantity,
    [TicketClass.BUSINESS]: (aircraftModel?.seatQuantity?.[TicketClass.BUSINESS] || 0) - businessSeatsQuantity,
  }

  console.log('id', flightLeg._id)
  console.log('flightLeg.remainingSeats[TicketClass.ECONOMY]', flightLeg.remainingSeats[TicketClass.ECONOMY])
  console.log('flightLeg.remainingSeats[TicketClass.BUSINESS]', flightLeg.remainingSeats[TicketClass.BUSINESS])
  console.log('economySeatsQuantity', economySeatsQuantity)
  console.log('businessSeatsQuantity', businessSeatsQuantity)
  console.log('reservations', reservations)
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
