import { model, Schema } from 'mongoose'

export interface ISurcharge {
  name: string
  value: number
}

const surchargeSchema = new Schema<ISurcharge>({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
})

const Surcharge = model<ISurcharge>('Surcharge', surchargeSchema)

export default Surcharge
