import { Router } from 'express'
import PaymentController from '@/controllers/payment.controller'
import authMiddleware from '@/middlewares/auth.middleware'
import fetchUserMiddleware from '@/middlewares/fetchUser.middleware'

const router = Router()

// router.route('/get-checkout-session').get(PaymentController.getCheckoutSession)
router.route('/get-payment-intent').get(PaymentController.getPaymentIntents)
router.route('/:id/refund').post(PaymentController.refund)
router.route('/:id/refund-by-staff').post(PaymentController.refundByStaff)

router.use(fetchUserMiddleware)

router.route('/payment-success').get(PaymentController.paymentSuccess)
router.route('/payment-success-by-staff').get(PaymentController.paymentSuccessByStaff)

export default router
