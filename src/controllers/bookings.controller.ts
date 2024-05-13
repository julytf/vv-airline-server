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
import ForbiddenError from '@/errors/ForbiddenError'
import { UserRole } from '@/enums/user.enums'

export default {
  getAllPaginate: catchPromise(async function (req: IRequestWithUser, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const query = new AdjustQuery(
      Booking.find({
        $or: [
          {
            'payment.status': PaymentStatus.SUCCEEDED,
          },
          {
            'payment.status': PaymentStatus.PARTIALLY_REFUNDED,
          },
          {
            'payment.status': PaymentStatus.REFUNDED,
          },
        ],
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
  getAllByMePaginate: catchPromise(async function (req: IRequestWithUser, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const user = req.user

    const query = new AdjustQuery(
      Booking.find({
        $or: [
          {
            staff: user,
            'payment.status': PaymentStatus.SUCCEEDED,
          },
          {
            staff: user,
            'payment.status': PaymentStatus.PARTIALLY_REFUNDED,
          },
          {
            staff: user,
            'payment.status': PaymentStatus.REFUNDED,
          },
        ],
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
  getMyAllPaginate: catchPromise(async function (req: IRequestWithUser, res, next) {
    const { sort = false, page = 1, perPage = 20, q = '' } = req.query

    const query = new AdjustQuery(
      Booking.find({
        $or: [
          {
            user: req.user?._id,
            'payment.status': PaymentStatus.SUCCEEDED,
          },
          {
            user: req.user?._id,
            'payment.status': PaymentStatus.PARTIALLY_REFUNDED,
          },
          {
            user: req.user?._id,
            'payment.status': PaymentStatus.REFUNDED,
          },
        ],
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
  getOne: catchPromise(async function (req: IRequestWithUser, res, next) {
    const { id } = req.params as { id: string }

    const doc = await Booking.findById(id)

    if (!doc) throw new NotFoundError('No document found!')

    // ! this is a temporary approach to allow only the owner of the booking to access the booking details
    // ! this app should separate admin and user routes
    if (
      (!doc.user || doc.user?._id.toString() !== req?.user?._id.toString()) &&
      ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req?.user?.role || UserRole.USER)
    ) {
      throw new ForbiddenError('You are not allowed to access this document!')
    }

    return res.status(200).json({
      status: 'success',
      data: { doc },
    })
  }),

  getOneByPnr: catchPromise(async function (req, res, next) {
    const { pnr, email } = req.query as { pnr: string; email: string }

    const doc = await Booking.findOne({
      pnr,
      'contactInfo.email': email,
    })

    if (!doc) throw new NotFoundError('No document found!')

    return res.status(200).json({
      status: 'success',
      data: { doc },
    })
  }),

  getByTimeRange: catchPromise(async function (req, res, next) {
    const { from, to } = req.query as { from: string; to: string }
    console.log({
      from: new Date(from),
      to: new Date(to),
    })
    // something is wrong, it always return all result
    const docs = await Booking.find({
      $or: [
        {
          'payment.paidAt': {
            $gte: new Date(from),
            $lte: new Date(to),
          },
          'payment.status': PaymentStatus.SUCCEEDED,
        },
        {
          'payment.paidAt': {
            $gte: new Date(from),
            $lte: new Date(to),
          },
          'payment.status': PaymentStatus.PARTIALLY_REFUNDED,
        },
        {
          'payment.paidAt': {
            $gte: new Date(from),
            $lte: new Date(to),
          },
          'payment.status': PaymentStatus.REFUNDED,
        },
      ],
    })

    if (!docs) throw new NotFoundError('No document found!')

    return res.status(200).json({
      status: 'success',
      data: {
        docs,
      },
    })
  }),
}
