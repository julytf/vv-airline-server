import { createOne } from '../controllers/factory/index'
import { Router } from 'express'
import FlightLegsController from '@/controllers/flightLegs.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()


router.route('/').get(FlightLegsController.getAllPaginate)
router.route('/get-by-departure-time').get(FlightLegsController.getByDepartureTime)
router.route('/:id').get(FlightLegsController.getOne)

router.use(authMiddleware)

router.route('/').post(FlightLegsController.createOne)
router.route('/:id').patch(FlightLegsController.updateOne)

export default router
