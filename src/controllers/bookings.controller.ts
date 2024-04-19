import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Booking from '@/models/booking/booking.model'
import { PaymentStatus } from '@/enums/payment.enums'

export default {
  getAllPaginate: catchPromise(async function (req, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const query = new AdjustQuery(
      Booking.find({
        'payment.status': PaymentStatus.SUCCEEDED,
      }),
    )
      .nameFilter(q as string)
      .paginate(page as number, perPage as number)
      .sort('-createdAt').query
    // console.log(q)
    const docs = await query

    if (!docs) throw new NotFoundError('No document found!')

    // docs.forEach(doc => doc?.completeImagesUrl())

    const count = await new AdjustQuery(
      Booking.find({
        payment: {
          status: PaymentStatus.SUCCEEDED,
        },
      }),
    )
      .nameFilter(q as string)
      .query.countDocuments()
    const lastPage = Math.ceil(count / (perPage as number)) || 1

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
  }),
  getOne: factory.getOne(Booking),
}
