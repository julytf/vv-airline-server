import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Aircraft from '@/models/aircraft/aircraft.model'
import Article from '@/models/article/article.model'
import AppError from '@/errors/AppError'
import multer from 'multer'

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
  multerUpload: upload.single('coverImage'),

  getAllPaginate: catchPromise(async function (req, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const query = new AdjustQuery(Article.find())
      .nameFilter(q as string)
      .paginate(page as number, perPage as number)
      .sort('-createdAt').query
    const docs = await query

    if (!docs) throw new NotFoundError('No document found!')

    // docs.forEach(doc => doc?.completeImagesUrl())

    const count = await new AdjustQuery(Article.find()).nameFilter(q as string).query.countDocuments()
    const lastPage = Math.ceil(count / (perPage as number))
    // console.log('lastPage', lastPage);
    // console.log('count', count);
    // console.log('perPage', perPage);

    return res.status(200).json({
      status: 'success',
      data: {
        totalDocs: docs.length,
        lastPage,
        page,
        perPage,
        docs,
      },
    })
  }),
  getFeaturedArticles: catchPromise(async function (req, res, next) {
    const docs = await Article.find({ isFeatured: true }).sort('-createdAt')

    res.status(201).json({
      status: 'success',
      data: docs,
    })
  }),
  getLatestArticles: catchPromise(async function (req, res, next) {
    const { quantity = 4 } = req.query

    const docs = await Article.find()
      .sort('-createdAt')
      .limit(quantity as number)

    res.status(201).json({
      status: 'success',
      data: docs,
    })
  }),
  getOne: factory.getOne(Article),
  createOne: catchPromise(async function (req, res, next) {
    const filePath = req.file?.path.replace('public', '')
    console.log('filePath', filePath)

    const doc = await Article.create({
      ...req.body,
      coverImage: filePath,
    })

    res.status(201).json({
      status: 'success',
      data: doc,
    })
  }),

  updateOne: catchPromise(async function (req, res, next) {
    const filePath = req.file?.path.replace('public', '')
    console.log('filePath', filePath)

    const doc = await Article.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        coverImage: filePath,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    // console.log(req.body)

    if (!doc) throw new NotFoundError('No document found!')

    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  }),
}
