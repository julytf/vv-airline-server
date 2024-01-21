import { Router } from 'express'
import paymentRoutes from './payment.routes'

const router = Router()

router.route('/api').get((req, res, next) => {
  return res.json({
    message: 'Welcome to Life Diary API!',
    status: 'success',
  })
})

router.use('/api/payment', paymentRoutes)

export default router
