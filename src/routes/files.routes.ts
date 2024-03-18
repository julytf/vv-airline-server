import { createOne } from './../controllers/factory/index';
import { Router } from 'express'
import FilesController from '@/controllers/files.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.route('/').get(FilesController.getAllPaginate)

export default router
