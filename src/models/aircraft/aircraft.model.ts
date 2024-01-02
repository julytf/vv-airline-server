import { AircraftStatuses } from '@/enums/aircraft.enums'
import { Schema, model } from 'mongoose'

export interface IAircraft {
  registrationNumber: string
  name?: string
  status?: AircraftStatuses
  aircraftModel?: Schema.Types.ObjectId
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
    enum: AircraftStatuses,
    default: AircraftStatuses.ACTIVE,
  },
  aircraftModel: {
    type: Schema.Types.ObjectId,
    ref: 'AircraftModel',
  },
})

const Aircraft = model<IAircraft>('Aircraft', aircraftSchema)

export default Aircraft
