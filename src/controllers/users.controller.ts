import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import { UserRole } from '@/enums/user.enums'

export default {
  getProfile: catchPromise(async function (req: Request, res, next) {
    const authUser = (req as IRequestWithUser).user!
    // console.log(authUser)
    // console.log(authUser._id)

    const user = await User.findById(authUser._id)
    // console.log(user)
    // console.log(user?._id)
    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  }),

  updateProfile: catchPromise(async function (req, res, next) {
    const authUser = (req as IRequestWithUser).user!
    // console.log('[info]:body', req.body)

    const patchedUser = req.body
    if (patchedUser.password) {
      delete patchedUser.password
    }

    const user = await User.findByIdAndUpdate(authUser._id, patchedUser, {
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

  getUsersPaginate: factory.getAllPaginate(User),

  createOne: catchPromise(async function (req, res, next) {
    const user = await new User({
      role: req.body.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      idNumber: req.body.idNumber,
      address: req.body.address,
    })
    await user.setPassword(req.body.password)

    // console.log('body', req.body)
    // console.log('user', user)

    await user.save()
    // console.log('saved')

    return res.status(201).json({
      status: 'success',
    })
  }),
}
