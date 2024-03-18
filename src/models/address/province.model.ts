import { ObjectId, Schema, Types, model } from 'mongoose'

export interface IProvince {
  code: string
  name: string
  nameEn: string
  fullName: string
  fullNameEn: string
  codeName: string
  countryCode: string
  districts?: Types.ObjectId[]
}

const provinceSchema = new Schema<IProvince>({
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
  countryCode: {
    type: String,
    required: true,
  },
  districts: [{ type: Schema.Types.ObjectId, ref: 'District' }],
})

const Province = model<IProvince>('Province', provinceSchema)

export default Province
