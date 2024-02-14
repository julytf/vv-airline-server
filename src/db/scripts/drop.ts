import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import * as DB from '@/db'

DB.connect()
  .then(() => DB.init())
  .then(async () => {
    await DB.drop()

    process.exit(0)
  })
