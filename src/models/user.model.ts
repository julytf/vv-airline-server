import { UserGender, UserRole, UserStatus } from '@/enums/user.enums'
import { Schema, model, connect, Document, CallbackError } from 'mongoose'
import bcrypt from 'bcrypt'
import Joi, { ValidationResult } from 'joi'
import userJoiSchema from '@/utils/validations/user.joiSchema'
import { IAddress, addressSchema } from './address/address.model'
import { addMinutes } from 'date-fns'

export interface IUser extends Document {
  role: UserRole
  firstName: string
  lastName: string
  _hashedPassword: string
  email: string
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: UserGender
  // idNumber?: string
  address?: IAddress
  isDeleted: boolean
  deletedAt?: Date
  resetToken?: {
    token: string
    expires: Date
  }

  setPassword(newPassword: string): Promise<void>
  matchPassword(password: string): Promise<boolean>
  joiValidate(): ValidationResult<any>
  createResetToken(): string

  // isAdmin(): boolean
}

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
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
    _hashedPassword: {
      type: String,
      required: true,
      maxLength: 60,
      select: false,
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
          return !value || value < new Date()
        },
        message: 'Date of birth must be in the past',
      },
    },
    gender: {
      type: String,
      enum: UserGender,
      default: UserGender.MALE,
    },
    // idNumber: {
    //   type: String,
    // },
    address: {
      type: addressSchema,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    resetToken: {
      token: {
        type: String,
      },
      expires: {
        type: Date,
      },
    },
  },
  { timestamps: true },
)

userSchema.method('setPassword', async function (newPassword: string) {
  const saltWorkFactor = Number(process.env.SALT_WORK_FACTOR)
  let user: IUser = this

  try {
    const salt = await bcrypt.genSalt(saltWorkFactor)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user._hashedPassword = hashedPassword
    // console.log(hashedPassword)
  } catch (err: any) {
    console.log(err)
  }
})

userSchema.method('matchPassword', async function (candidatePassword: string) {
  const user: IUser = await User.findById(this._id).select('+_hashedPassword')

  // console.log(candidatePassword, user._hashedPassword)
  const isMatch = await bcrypt.compare(candidatePassword, user._hashedPassword)
  return isMatch
})

userSchema.method('joiValidate', function () {
  const user: IUser = this
  return userJoiSchema.validate(user)
})

userSchema.method('createResetToken', function () {
  const user: IUser = this

  user.resetToken = {
    token: Math.floor(100000 + Math.random() * 900000).toString(),
    expires: addMinutes(new Date(), 15),
  }
  // user.save()

  // userSchema.method('isAdmin', function () {
  //   const user: IUser = this
  //   return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)
  // })

  return user.resetToken.token
})

const User = model<IUser>('User', userSchema)

export default User
