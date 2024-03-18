import { Router } from 'express'
import UsersController from '@/controllers/users.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/get-profile').get(UsersController.getProfile)
router.route('/update-profile').patch(UsersController.updateProfile)
router.route('/').get(UsersController.getUsersPaginate)

export default router
