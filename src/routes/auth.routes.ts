import { Router } from 'express'
import * as AuthController from '@/controllers/auth.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.route('/register').post(AuthController.register)
router.route('/login').post(AuthController.login)

router.use(authMiddleware)

router.route('/logout').post(AuthController.logout)
router.route('/get-profile').get(AuthController.getProfile)
router.route('/update-profile').patch(AuthController.updateProfile)
router.route('/change-password').post(AuthController.changePassword)
router.route('/delete-profile').delete(AuthController.deleteProfile)

export default router
