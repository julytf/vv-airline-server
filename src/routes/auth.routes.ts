import { Router } from 'express'
import authMiddleware from '@/middlewares/auth.middleware'
import AuthController from '@/controllers/auth.controller'

const router = Router()

router.route('/register').post(AuthController.register)
router.route('/login').post(AuthController.login)

router.use(authMiddleware)

router.route('/logout').post(AuthController.logout)
router.route('/change-password').post(AuthController.changePassword)
router.route('/delete-profile').delete(AuthController.deleteProfile)

export default router
