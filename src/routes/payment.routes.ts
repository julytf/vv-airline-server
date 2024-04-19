import { Router } from 'express'
import PaymentController from '@/controllers/payment.controller'

const router = Router()

// router.route('/get-checkout-session').get(PaymentController.getCheckoutSession)
router.route('/get-payment-intent').get(PaymentController.getPaymentIntents)
router.route('/payment-success').get(PaymentController.paymentSuccess)

export default router
