import { SeatStatus, SeatType } from '@/enums/seat.enums'
import { TicketClass } from '@/enums/ticket.enums'
import { Schema, model } from 'mongoose'

export interface ISeat {
  code: string
  row: number
  col: string
  status?: SeatStatus
  seatType?: SeatType
  ticketClass?: TicketClass
  // aircraftModel: Types.ObjectId
  // surcharge?: number
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
  ticketClass: {
    type: String,
    enum: TicketClass,
    default: TicketClass.ECONOMY,
  },
  // aircraftModel: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'AircraftModel',
  // },
  // surcharge: {
  //   type: Number,
  // },
})

const Seat = model<ISeat>('Seat', seatSchema)

export default Seat
