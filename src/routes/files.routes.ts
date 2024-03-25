import { createOne } from './../controllers/factory/index'
import { Router } from 'express'
import FilesController from '@/controllers/files.controller'
import authMiddleware from '@/middlewares/auth.middleware'
import multer from 'multer'

const router = Router()

router.use(authMiddleware)

router.route('/upload-image').post(FilesController.multerUpload, FilesController.uploadImage)

export default router
