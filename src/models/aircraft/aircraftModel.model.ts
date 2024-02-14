import { SeatClass } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

interface IRowModel {
  hasExit: boolean
  seats: Schema.Types.ObjectId[][]
}

const rowModelSchema = new Schema<IRowModel>({
  hasExit: Boolean,
  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
    },
  ],
})

interface ICabinModel {
  class: SeatClass
  noRow: number
  noCol: number
  aisleCol: number[]
  map: IRowModel[]
}

const cabinModelSchema = new Schema<ICabinModel>({
  class: {
    type: String,
    enum: SeatClass,
    default: SeatClass.ECONOMY,
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
  seatMap: ICabinModel[]
}

const aircraftModelSchema = new Schema<IAircraftModel>({
  name: {
    type: String,
  },
  seatMap: [cabinModelSchema],
})

const AircraftModel = model<IAircraftModel>('AircraftModel', aircraftModelSchema)

export default AircraftModel
