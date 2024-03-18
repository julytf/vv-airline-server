import { createOne } from '../controllers/factory/index';
import { Router } from 'express'
import BlogsController from '@/controllers/blogs.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.route('/').get(BlogsController.getAllPaginate)
router.route('/').post(BlogsController.createOne)

router.route('/:id').get(BlogsController.getOne)
router.route('/:id').patch(BlogsController.updateOne)

export default router
