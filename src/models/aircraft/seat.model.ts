import { SeatClasses, SeatStatuses, SeatTypes } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface ISeat {
  row: number
  col: number
  status?: SeatStatuses
  seatType?: SeatTypes
  seatClass?: SeatClasses
  // aircraftModel: Schema.Types.ObjectId
}

const seatSchema = new Schema<ISeat>({
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
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
