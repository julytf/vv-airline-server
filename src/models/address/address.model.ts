import { Schema, model } from 'mongoose'

export interface IAddress {
  address: string
  address2?: string
  province: Schema.Types.ObjectId
  district?: Schema.Types.ObjectId
  ward?: Schema.Types.ObjectId
}

export const addressSchema = new Schema<IAddress>({
  address: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  province: {
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

const Address = model<IAddress>('Address', addressSchema)

export default Address
