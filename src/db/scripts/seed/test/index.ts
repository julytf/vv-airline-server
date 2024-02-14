import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import * as DB from '@/db'
import seedUser from './seedUser'
import seedAircraft from './seedAircraft'
import seedFlight from './seedFlight'

DB.connect()
  .then(() => DB.init())
  .then(async () => {
    await Seed()
  })

async function Seed() {
  await seedUser()
  await seedAircraft()
  await seedFlight()

  process.exit(0)
}
