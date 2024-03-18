import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import * as DB from '@/db'
import seedUser from './seedUser'
import seedAircraft from './seedAircraft'
import seedFlight from './seedFlight'
import seedBlogs from './seedBlogs'

DB.connect()
  .then(() => DB.init())
  .then(async () => {
    await Seed()
  })

async function Seed() {
  // await seedUser()
  // await seedAircraft()
  // await seedFlight()

  await seedBlogs()

  process.exit(0)
}
