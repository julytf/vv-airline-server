import { ObjectId, Schema, Types, model } from 'mongoose'

export interface IDistrict {
  code: string
  name: string
  nameEn: string
  fullName: string
  fullNameEn: string
  codeName: string
  provinceCode: string
  // province: Types.ObjectId
  wards?: Types.ObjectId[]
}

const districtSchema = new Schema<IDistrict>({
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
  provinceCode: {
    type: String,
    required: true,
  },
  // province: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Province',
  //   required: true,
  // },
  wards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ward',
    },
  ],
})

const District = model<IDistrict>('District', districtSchema)

export default District
