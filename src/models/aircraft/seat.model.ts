import { SeatClass, SeatStatus, SeatType } from '@/enums/seat.enums'
import { Schema, model } from 'mongoose'

export interface ISeat {
  code: string
  row: number
  col: string
  status?: SeatStatus
  seatType?: SeatType
  seatClass?: SeatClass
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
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  },
  seatType: {
    type: String,
    enum: SeatType,
    default: SeatType.NORMAL,
  },
  seatClass: {
    type: String,
    enum: SeatClass,
    default: SeatClass.ECONOMY,
  },
  // aircraftModel: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'AircraftModel',
  // },
})

const Seat = model<ISeat>('Seat', seatSchema)

export default Seat
