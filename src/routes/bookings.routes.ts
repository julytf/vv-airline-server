import { createOne } from '../controllers/factory/index'
import { Router } from 'express'
import BookingsController from '@/controllers/bookings.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/').get(BookingsController.getAllPaginate)
router.route('/:id').get(BookingsController.getOne)

export default router
