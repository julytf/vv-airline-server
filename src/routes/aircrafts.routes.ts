import { createOne } from '../controllers/factory/index';
import { Router } from 'express'
import AircraftsController from '@/controllers/aircrafts.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/').get(AircraftsController.getAllPaginate)
router.route('/all').get(AircraftsController.getAll)
router.route('/').post(AircraftsController.createOne)

router.route('/:id').get(AircraftsController.getOne)
router.route('/:id').patch(AircraftsController.updateOne)

export default router
