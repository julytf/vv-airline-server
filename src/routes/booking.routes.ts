import { Router } from 'express'
import BookingController from '@/controllers/booking.controller'
import fetchUserMiddleware from '@/middlewares/fetchUser.middleware'

const router = Router()

router.use(fetchUserMiddleware)

router.route('/create-temp-booking').post(BookingController.createTempBooking)

export default router
