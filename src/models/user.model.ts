import { UserGenders, UserRoles } from '@/enums/user.enums'
import { Schema, model, connect } from 'mongoose'
import addressSchema, { IAddress } from './schemas/address.schema'

export interface IUser {
  role: UserRoles
  firstName: string
  lastName: string
  hashedPassword: string
  email: string
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: UserGenders
  idNumber?: string
  address?: IAddress
}

const userSchema = new Schema<IUser>({
  role: {
    type: String,
    enum: UserRoles,
    default: UserRoles.USER,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 2,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 2,
  },
  hashedPassword: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    index: true,
    required: true,
    validate: {
      validator: (value: string) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return emailRegex.test(value)
      },
      message: 'Invalid email format',
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: (value: string) => {
        return value.length >= 10 && value.length <= 15
      },
      message: 'Phone number must be between 10 and 15 digits',
    },
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: (value: Date) => {
        return  !value || value < new Date()
      },
      message: 'Date of birth must be in the past',
    },
  },
  gender: {
    type: String,
    enum: UserGenders,
  },
  idNumber: {
    type: String,
  },
  address: {
    type: addressSchema,
  },
})

const User = model<IUser>('User', userSchema)

export default User
