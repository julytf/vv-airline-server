import { ObjectId, Schema, Types, model } from 'mongoose'

export interface ICountry {
  code: string
  name: string
  nameEn: string
  fullName: string
  fullNameEn: string
  codeName: string
  provinces?: Types.ObjectId[]
}

export const countrySchema = new Schema<ICountry>({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  fullNameEn: {
    type: String,
    required: true,
  },
  codeName: {
    type: String,
    required: true,
  },
  provinces: [{ type: Schema.Types.ObjectId, ref: 'Province' }],
})

const Country = model<ICountry>('Country', countrySchema)

export default Country
