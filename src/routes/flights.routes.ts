import { createOne } from '../controllers/factory/index'
import { Router } from 'express'
import FlightsController from '@/controllers/flights.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()


router.route('/').get(FlightsController.getAllPaginate)
router.route('/:id').get(FlightsController.getOne)

router.use(authMiddleware)

router.route('/').post(FlightsController.createOne)
router.route('/:id').patch(FlightsController.updateOne)

export default router
