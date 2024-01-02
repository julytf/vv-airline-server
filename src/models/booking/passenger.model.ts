import { Schema, model, connect } from 'mongoose'
import { UserGenders } from '@/enums/user.enums'
import { PassengerTypes } from '@/enums/passenger.enums'

export interface IPassenger {
  type: PassengerTypes
  email?: string
  phoneNumber?: string
  firstName: string
  lastName: string
  dateOfBirth?: Date
  gender?: UserGenders
  // booking: Schema.Types.ObjectId
}

const passengerSchema = new Schema<IPassenger>({
  type: {
    type: String,
    enum: PassengerTypes,
    required: true,
    default: PassengerTypes.ADULT,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
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
    enum: UserGenders,
  },
  // booking: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Booking',
  // },
})

const Passenger = model<IPassenger>('Passenger', passengerSchema)

export default Passenger
