import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import Airport from '@/models/flight/airport.model'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Aircraft from '@/models/aircraft/aircraft.model'

export default {
  getAllPaginate: catchPromise(async function (req, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const query = new AdjustQuery(Airport.find().populate('country'))
      .nameFilter(q as string)
      .paginate(page as number, perPage as number)
      .sort('-createdAt').query
    const docs = await query

    if (!docs) throw new NotFoundError('No document found!')

    // docs.forEach(doc => doc?.completeImagesUrl())

    const count = await new AdjustQuery(Airport.find()).nameFilter(q as string).query.countDocuments()
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
  getOne: factory.getOne(Airport),
  createOne: factory.createOne(Airport),
  updateOne: factory.updateOne(Airport),
}
