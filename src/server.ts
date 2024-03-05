import 'module-alias/register'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import * as DB from './db'
import app from './app'

const port = process.env.PORT || 3000

let server

DB.connect()
  .then(() => DB.init())
  .then(() => {
    server = app.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  })
