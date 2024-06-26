import { model, Schema } from 'mongoose'

export interface ISurcharge {
  title: string
  name: string
  value: number | null
}

const surchargeSchema = new Schema<ISurcharge>({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
  },
})

const Surcharge = model<ISurcharge>('Surcharge', surchargeSchema)

export default Surcharge
