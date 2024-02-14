import { Router } from 'express'
import * as PaymentController from '@/controllers/payment.controller'

const router = Router()

router.route('/intents').get(PaymentController.intents)

export default router
