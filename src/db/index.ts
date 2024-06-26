// require('module-alias/register')

import Aircraft from '@/models/aircraft/aircraft.model'
import AircraftModel from '@/models/aircraft/aircraftModel.model'
import Airport from '@/models/flight/airport.model'
import FlightLeg from '@/models/flight/flightLeg.model'
import Flight from '@/models/flight/flight.model'
import FlightRoute from '@/models/flight/flightRoute.model'
import User from '@/models/user.model'
import mongoose, { Model } from 'mongoose'
import Seat from '@/models/aircraft/seat.model'
import Reservation from '@/models/booking/reservation.model'
import Booking from '@/models/booking/booking.model'
import Article from '@/models/article/article.model'
import Passenger from '@/models/booking/passenger.model'
import Surcharge from '@/models/flight/surcharge.model'

mongoose.set('strictQuery', true)

if (!process.env.MONGODB_STRING || !process.env.MONGODB_DATABASE) {
  throw new Error('Some DB configs have not set yet')
}
let DB_string = process.env.MONGODB_STRING.replace('<database>', process.env.MONGODB_DATABASE)

if (process.env.MONGODB_TYPE != 'local') {
  if (!process.env.MONGODB_STRING || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
    throw new Error('Some DB configs have not set yet')
  }
  DB_string = DB_string.replace('<username>', process.env.MONGODB_USERNAME).replace(
    '<password>',
    process.env.MONGODB_PASSWORD,
  )
}

export const connect = () => mongoose.connect(DB_string, {}).then(() => console.log('DB connect successful'))

export const init = () =>
  Promise.all([FlightLeg.init(), FlightRoute.init()]).then(() => console.log('DB init successful'))

export const drop = async () => {
  await Promise.all([
    User.deleteMany({}),
    AircraftModel.deleteMany({}),
    Aircraft.deleteMany({}),
    Airport.deleteMany({}),
    FlightRoute.deleteMany({}),
    FlightLeg.deleteMany({}),
    Flight.deleteMany({}),
    Seat.deleteMany({}),
    Reservation.deleteMany({}),
    Booking.deleteMany({}),
    Article.deleteMany({}),
    Passenger.deleteMany({}),
    Surcharge.deleteMany({}),
  ]).then(() => console.log('DB drop successful'))
  // await mongoose.connection.db.dropDatabase()
}
