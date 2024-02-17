import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'

const stripe = new Stripe(config.stripe.secretKey)

export default {
  getProfile: catchPromise(async function (req: Request, res, next) {
    const authUser = (req as IRequestWithUser).user!
    console.log(authUser)
    console.log(authUser.id)

    const user = await User.findById(authUser.id)
    console.log(user)
    console.log(user?.id)
    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  }),

  updateProfile: catchPromise(async function (req, res, next) {
    const authUser = (req as IRequestWithUser).user!
    console.log('[info]:body', req.body)

    const user = await User.findByIdAndUpdate(authUser.id, req.body, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  }),

  getUsers: factory.getAllPaginate(User),
}
