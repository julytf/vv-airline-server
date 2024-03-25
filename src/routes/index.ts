import { Router } from 'express'
import paymentRoutes from './payment.routes'
import authRoutes from './auth.routes'
import usersRoutes from './users.routes'
import searchWizardRoutes from './searchWizard.routes'
import bookingRoutes from './booking.routes'
import airportsRoutes from './airports.routes'
import flightRoutesRoutes from './flightRoutes.routes'
import flightLegsRoutes from './flightLegs.routes'
import addressRoutes from './address.routes'
import articlesRoutes from './articles.routes'
import filesRoutes from './files.routes'
import flightsRoutes from './flights.routes'
import aircraftsRoutes from './aircrafts.routes'
import aircraftModelsRoutes from './aircraftModels.routes'

const router = Router()

router.route('/api').get((req, res, next) => {
  return res.json({
    message: 'Welcome to Life Diary API!',
    status: 'success',
  })
})

router.use('/api/auth', authRoutes)
router.use('/api/files', filesRoutes)
router.use('/api/search-wizard', searchWizardRoutes)
router.use('/api/payment', paymentRoutes)

router.use('/api/aircrafts', aircraftsRoutes)
router.use('/api/aircraft-models', aircraftModelsRoutes)

router.use('/api/address', addressRoutes)

router.use('/api/articles', articlesRoutes)

router.use('/api/booking', bookingRoutes)

router.use('/api/airports', airportsRoutes)
router.use('/api/flight-legs', flightLegsRoutes)
router.use('/api/flight-routes', flightRoutesRoutes)
router.use('/api/flights', flightsRoutes)

router.use('/api/users', usersRoutes)

export default router
