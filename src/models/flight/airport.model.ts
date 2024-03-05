import { Schema, model } from 'mongoose'
import { IAddress, addressSchema } from '../address/address.model'
import { AirportType } from '@/enums/airport.enums'
import Country, { ICountry, countrySchema } from '../address/country.model'

export interface IAirport {
  IATA: string
  cityCode: string
  countryCode: string
  city: string
  country: ICountry
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
  cityCode: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: countrySchema,
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

const Airport = model<IAirport>('Airport', airportSchema)

export default Airport
