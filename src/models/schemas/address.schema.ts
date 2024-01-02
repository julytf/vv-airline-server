import { Schema } from 'mongoose'

export interface IAddress {
  address: string
  address2?: string
  city: Schema.Types.ObjectId
  district?: Schema.Types.ObjectId
  ward?: Schema.Types.ObjectId
}

const addressSchema = new Schema<IAddress>({
  address: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  district: {
    type: Schema.Types.ObjectId,
    ref: 'District',
  },
  ward: {
    type: Schema.Types.ObjectId,
    ref: 'Ward',
  },
})

export default addressSchema