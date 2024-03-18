import { Router } from 'express'
import BookingController from '@/controllers/booking.controller'

const router = Router()

router.route('/create-temp-booking').post(BookingController.createTempBooking)

export default router
