import AdjustQuery from '@/utils/adjustQuery'
import AppError from '@/errors/AppError'
import catchPromise from '@/utils/catchPromise'
import { Model } from 'mongoose'
import { Request } from 'express'
import NotFoundError from '@/errors/NotFoundError'

export const getOne = function (Model: Model<any, any, any>) {
  return catchPromise(async function (req, res, next) {
    const doc = await Model.findById(req.params.id)
    console.log(req.params.id)

    if (!doc) throw new NotFoundError('No document found!')

    return res.status(200).json({
      status: 'success',
      data: { doc },
    })
  })
}
// TODO: filter, sort, limitfields, paginate
export const getAll = function (Model: Model<any, any, any>) {
  return catchPromise(async function (req, res, next) {
    const query = Model.find()
    const docs = await query

    if (!docs) throw new NotFoundError('No document found!')

    // docs.forEach(doc => doc?.completeImagesUrl())

    const count = await Model.countDocuments()

    return res.status(200).json({
      status: 'success',
      data: docs,
    })
  })
}

export const getAllPaginate = function (Model: Model<any, any, any>) {
  return catchPromise(async function (req, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const query = new AdjustQuery(Model.find())
      .nameFilter(q as string)
      .paginate(page as number, perPage as number)
      .sort('-createdAt').query
    // console.log(q)
    const docs = await query

    if (!docs) throw new NotFoundError('No document found!')

    // docs.forEach(doc => doc?.completeImagesUrl())

    const count = await new AdjustQuery(Model.find()).nameFilter(q as string).query.countDocuments()
    const lastPage = Math.ceil(count / (perPage as number))

    return res.status(200).json({
      status: 'success',
      data: {
        totalDocs: docs.length,
        lastPage: lastPage,
        page,
        perPage,
        docs,
      },
    })
  })
}

export const createOne = function (Model: Model<any, any, any>) {
  return catchPromise(async function (req, res, next) {
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: doc,
    })
  })
}

export const updateOne = function (Model: Model<any, any, any>) {
  return catchPromise(async function (req, res, next) {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    // console.log(req.body)

    if (!doc) throw new NotFoundError('No document found!')

    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  })
}

export const deleteOne = function (Model: Model<any, any, any>) {
  return catchPromise(async function (req, res, next) {
    const rs = await Model.deleteOne({ _id: req.params.id })
    // console.log(req.params.id)

    if (!rs.deletedCount) throw new NotFoundError('No document found!')

    // const doc = await Model.findById(authUser.id)

    // if (!doc) throw new NotFoundError('No document found!')

    // doc.deletedAt = new Date()

    // await doc.save()

    return res.status(204).send()
  })
}
