import { Router } from 'express'
import UsersController from '@/controllers/users.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)
// TODO: check role

router.route('/get-profile').get(UsersController.getProfile)
router.route('/update-profile').patch(UsersController.updateProfile)
router.route('/').get(UsersController.getUsersPaginate)
router.route('/').post(UsersController.createOne)
router.route('/:id').get(UsersController.getOne)
router.route('/:id').patch(UsersController.updateOne)

export default router
