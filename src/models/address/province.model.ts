import { Schema, model } from 'mongoose'

export interface IProvince {
  code: string
  name: string
  nameEn: string
  fullName: string
  fullNameEn: string
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
})

const Province = model<IProvince>('Province', provinceSchema)

export default Province
