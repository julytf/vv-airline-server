import { Schema, model } from 'mongoose'
import { IAddress, addressSchema } from '../address/address.model'

export interface IAirport {
  name: string
  description?: string
  longitude?: number
  latitude?: number
  address?: IAddress
}

const airportSchema = new Schema<IAirport>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  address: {
    type: addressSchema,
  },
})

const Airport = model<IAirport>('Airport', airportSchema)

export default Airport
