import { Schema, model, connect } from 'mongoose'
import { UserGender } from '@/enums/user.enums'
import { PassengerType } from '@/enums/passenger.enums'

export interface IPassenger {
  type: PassengerType
  // email?: string
  // phoneNumber?: string
  firstName: string
  lastName: string
  dateOfBirth?: Date
  gender?: UserGender
  // booking: Schema.Types.ObjectId
}

const passengerSchema = new Schema<IPassenger>({
  type: {
    type: String,
    enum: PassengerType,
    required: true,
    default: PassengerType.ADULT,
  },
  // email: {
  //   type: String,
  // },
  // phoneNumber: {
  //   type: String,
  // },
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
    enum: UserGender,
  },
  // booking: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Booking',
  // },
})

const Passenger = model<IPassenger>('Passenger', passengerSchema)

export default Passenger
