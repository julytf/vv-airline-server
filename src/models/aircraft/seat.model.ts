import { SeatClasses, SeatStatuses, SeatTypes } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface ISeat {
  code: string
  row: number
  col: string
  status?: SeatStatuses
  seatType?: SeatTypes
  seatClass?: SeatClasses
  // aircraftModel: Schema.Types.ObjectId
}

const seatSchema = new Schema<ISeat>({
  code: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: SeatStatuses,
    default: SeatStatuses.AVAILABLE,
  },
  seatType: {
    type: String,
    enum: SeatTypes,
    default: SeatTypes.NORMAL,
  },
  seatClass: {
    type: String,
    enum: SeatClasses,
    default: SeatClasses.ECONOMY,
  },
  // aircraftModel: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'AircraftModel',
  // },
})

const Seat = model<ISeat>('Seat', seatSchema)

export default Seat
