import { Schema, model } from 'mongoose'

export interface IAircraftModel {
  name?: string
  seatMap: {
    noRow: number
    noCol: number
    aisleCol: number[]
    exitRow: number[]
  }
  seats: {
    type: Schema.Types.ObjectId
    ref: 'Seat'
  }[]
}

const aircraftModelSchema = new Schema<IAircraftModel>({
  name: {
    type: String,
  },
  seatMap: {
    noRow: {
      type: Number,
      required: true,
    },
    noCol: {
      type: Number,
      required: true,
    },
    aisleCol: [Number],
    exitRow: [Number],
  },
  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
    },
  ],
})

const AircraftModel = model<IAircraftModel>('AircraftModel', aircraftModelSchema)

export default AircraftModel
