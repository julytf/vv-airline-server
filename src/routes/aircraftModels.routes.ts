import { createOne } from '../controllers/factory/index';
import { Router } from 'express'
import AircraftModelsController from '@/controllers/aircraftModels.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/').get(AircraftModelsController.getAllPaginate)
router.route('/all').get(AircraftModelsController.getAll)
router.route('/').post(AircraftModelsController.createOne)

router.route('/:id').get(AircraftModelsController.getOne)
router.route('/:id').patch(AircraftModelsController.updateOne)

export default router
