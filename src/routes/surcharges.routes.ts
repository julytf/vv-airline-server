import { updateOne } from './../controllers/factory/index'
import { Router } from 'express'
import SurchargesController from '@/controllers/surcharges.controller'

const router = Router()

router.route('/').get(SurchargesController.getSurcharges)
router.route('/:id').patch(SurchargesController.updateOne)

export default router
