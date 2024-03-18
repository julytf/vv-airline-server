import { Router } from 'express'
import paymentRoutes from './payment.routes'
import authRoutes from './auth.routes'
import usersRoutes from './users.routes'
import searchWizardRoutes from './searchWizard.routes'
import bookingRoutes from './booking.routes'
import airportsRoutes from './airports.routes'
import addressRoutes from './address.routes'
import blogsRoutes from './blogs.routes'

const router = Router()

router.route('/api').get((req, res, next) => {
  return res.json({
    message: 'Welcome to Life Diary API!',
    status: 'success',
  })
})

router.use('/api/booking', bookingRoutes)
router.use('/api/payment', paymentRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/users', usersRoutes)
router.use('/api/airports', airportsRoutes)
router.use('/api/address', addressRoutes)
router.use('/api/blogs', blogsRoutes)
router.use('/api/search-wizard', searchWizardRoutes)

export default router
