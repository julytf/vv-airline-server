import { Schema, model } from 'mongoose'

export interface IService {
  name: string
  price: number
}

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  price: {
    type: Number,
    required: true,
  },
})

const Service = model<IService>('Service', serviceSchema)

export default Service
