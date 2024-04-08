import { Router } from 'express'
import SurchargesController from '@/controllers/surcharges.controller'

const router = Router()

router.route('/').get(SurchargesController.getSurcharges)

export default router
