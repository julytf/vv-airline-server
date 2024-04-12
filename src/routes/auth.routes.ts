import { Router } from 'express'
import authMiddleware from '@/middlewares/auth.middleware'
import AuthController from '@/controllers/auth.controller'

const router = Router()

router.route('/register').post(AuthController.register)
router.route('/login').post(AuthController.login)

router.route('/request-reset-password-otp-email').post(AuthController.requestResetPasswordOTPEmail)
router.route('/verify-otp').post(AuthController.verifyOTP)
router.route('/reset-password-with-otp').post(AuthController.resetPasswordWithOTP)

router.use(authMiddleware)

router.route('/logout').post(AuthController.logout)
router.route('/change-password').patch(AuthController.changePassword)
router.route('/delete-profile').delete(AuthController.deleteProfile)


export default router
