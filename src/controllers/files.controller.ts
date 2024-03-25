import config from '@/config'
import AppError from '@/errors/AppError'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import Country from '@/models/address/country.model'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import Stripe from 'stripe'

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req: IRequestWithUser, file, cb) => {
    if (!req.user) return cb(new AppError('User not found'), '')

    const ext = file.mimetype.split('/')[1]
    cb(null, `${req.user._id}-${Date.now()}.${ext}`)
  },
})

const multerFilter = (req: IRequestWithUser, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!req.user) return cb(new AppError('User not found'))

  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images.'))
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

export default {
  multerUpload: upload.single('image'),

  uploadImage: async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file)
    console.log(req.body)

    const filePath = req.file?.path.replace('public', '')

    return res.json({
      status: 'success',
      data: {
        filePath: filePath,
      },
    })
  },
}
