import { createOne } from './../controllers/factory/index';
import { Router } from 'express'
import AirportsController from '@/controllers/airports.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/').get(AirportsController.getAllPaginate)
router.route('/all').get(AirportsController.getAll)
router.route('/').post(AirportsController.createOne)

router.route('/:id').get(AirportsController.getOne)
router.route('/:id').patch(AirportsController.updateOne)

export default router
