import { Schema, model } from 'mongoose'

export interface IWard {
  code: string
  name: string
  nameEn: string
  fullName: string
  fullNameEn: string
  codeName: string
  districtCode: string
  // district: Schema.Types.ObjectId
}

const wardSchema = new Schema<IWard>({
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
  districtCode: {
    type: String,
    required: true,
  },
  // district: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'District',
  //   required: true,
  // },
})

const Ward = model<IWard>('Ward', wardSchema)

export default Ward
