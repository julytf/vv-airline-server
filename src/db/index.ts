// require('module-alias/register')
import mongoose from 'mongoose'

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
    process.env.MONGODB_PASSWORD
  )
}

export const connect = () => mongoose.connect(DB_string, {}).then(() => console.log('DB connect successful'))

export const init = () =>
  Promise.all([
    // require('@/models/Author.model').init(),
  ]).then(() => console.log('DB init successful'))

export const drop = () =>
  Promise.all([
    // require('@/models/Author.model').deleteMany({}),
  ]).then(() => console.log('DB drop successful'))
