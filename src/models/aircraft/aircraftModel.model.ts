import { TicketClass } from '@/enums/ticket.enums'
import { Schema, Types, model } from 'mongoose'

interface IRowModel {
  index: number
  hasExit: boolean
  seats: Types.ObjectId[]
}

const rowModelSchema = new Schema<IRowModel>({
  index: Number,
  hasExit: Boolean,
  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
    },
  ],
})

interface ICabinModel {
  class: TicketClass
  noRow: number
  noCol: number
  aisleCol: number[]
  map: IRowModel[]
}

const cabinModelSchema = new Schema<ICabinModel>({
  class: {
    type: String,
    enum: TicketClass,
    default: TicketClass.ECONOMY,
    required: true,
  },
  noRow: {
    type: Number,
    required: true,
  },
  noCol: {
    type: Number,
    required: true,
  },
  aisleCol: [Number],
  map: [rowModelSchema],
})

export interface IAircraftModel {
  name?: string
  seatQuantity: {
    [TicketClass.ECONOMY]: number
    [TicketClass.BUSINESS]: number
  }
  seatMap: ICabinModel[]
}

const aircraftModelSchema = new Schema<IAircraftModel>({
  name: {
    type: String,
  },
  seatQuantity: {
    [TicketClass.ECONOMY]: { type: Number },
    [TicketClass.BUSINESS]: { type: Number },
  },
  seatMap: [cabinModelSchema],
})

aircraftModelSchema.pre('find', async function (next) {
  this.populate('seatMap.map.seats')
  next()
})

const AircraftModel = model<IAircraftModel>('AircraftModel', aircraftModelSchema)

export default AircraftModel
