import { createOne } from '../controllers/factory/index'
import { Router } from 'express'
import ArticlesController from '@/controllers/articles.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.route('/get-featured-articles').get(ArticlesController.getFeaturedArticles)
router.route('/get-latest-articles').get(ArticlesController.getLatestArticles)

router.route('/:id').get(ArticlesController.getOne)

router.route('/').get(ArticlesController.getAllPaginate)

router.use(authMiddleware)

router.route('/').post(ArticlesController.multerUpload, ArticlesController.createOne)

router.route('/:id').patch(ArticlesController.multerUpload, ArticlesController.updateOne)

export default router
