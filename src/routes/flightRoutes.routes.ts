import { createOne } from '../controllers/factory/index'
import { Router } from 'express'
import FlightRoutesController from '@/controllers/flightRoutes.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/').get(FlightRoutesController.getAllPaginate)
router.route('/').post(FlightRoutesController.createOne)

router.route('/:id').get(FlightRoutesController.getOne)
router.route('/:id').patch(FlightRoutesController.updateOne)

export default router
