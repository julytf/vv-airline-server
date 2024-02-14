// require('module-alias/register')

import Aircraft from '@/models/aircraft/aircraft.model'
import AircraftModel from '@/models/aircraft/aircraftModel.model'
import Airport from '@/models/flight/airport.model'
import Flight from '@/models/flight/flight.model'
import FlightRoute from '@/models/flight/flightRoute.model'
import User from '@/models/user.model'
import mongoose, { Model } from 'mongoose'

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
  Promise.all([
    // require('@/models/Author.model').init(),
  ]).then(() => console.log('DB init successful'))

export const drop = async () => {
  await Promise.all([
    User.deleteMany({}),
    AircraftModel.deleteMany({}),
    Aircraft.deleteMany({}),
    Airport.deleteMany({}),
    FlightRoute.deleteMany({}),
    Flight.deleteMany({}),
  ]).then(() => console.log('DB drop successful'))
  // await mongoose.connection.db.dropDatabase()
}
