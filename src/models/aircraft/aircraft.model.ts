import { AircraftStatus } from '@/enums/aircraft.enums'
import { Schema, Types, model } from 'mongoose'

export interface IAircraft {
  registrationNumber: string
  name?: string
  status?: AircraftStatus
  aircraftModel?: Types.ObjectId
}

const aircraftSchema = new Schema<IAircraft>({
  registrationNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  status: {
    type: String,
    enum: AircraftStatus,
    default: AircraftStatus.ACTIVE,
  },
  aircraftModel: {
    type: Schema.Types.ObjectId,
    ref: 'AircraftModel',
  },
})

const Aircraft = model<IAircraft>('Aircraft', aircraftSchema)

export default Aircraft
