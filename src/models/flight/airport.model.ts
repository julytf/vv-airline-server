import { Schema, Types, model } from 'mongoose'
import { IAddress, addressSchema } from '../address/address.model'
import { AirportType } from '@/enums/airport.enums'
import Country, { ICountry, countrySchema } from '../address/country.model'

export interface IAirport {
  IATA: string
  // countryCode: string
  city: string
  country: Types.ObjectId
  type: AirportType
  name: string
  description?: string
  longitude?: number
  latitude?: number
  address?: IAddress
}

const airportSchema = new Schema<IAirport>({
  IATA: {
    type: String,
  },
  // countryCode: {
  //   type: String,
  // },
  city: {
    type: String,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
  },
  type: {
    type: String,
    enum: AirportType,
  },
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

airportSchema.pre('find', async function (next) {
  this.populate('country')
  next()
})

const Airport = model<IAirport>('Airport', airportSchema)

export default Airport
