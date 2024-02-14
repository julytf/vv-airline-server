import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import * as DB from '@/db'
import seedAddress from './seedAddress'

DB.connect()
  .then(() => DB.init())
  .then(async () => {
    await Seed()
  })

async function Seed() {
  await seedAddress()

  process.exit(0)
}
