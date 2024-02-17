import IRequestWithUser from '@/interfaces/IRequestWithUser'
import { UserRole, UserStatus } from '@/enums/user.enums'
import User, { IUser } from '@/models/user.model'
import catchPromise from '@/utils/catchPromise'
import jwt, { Secret } from 'jsonwebtoken'
import { Request } from 'express'
import AppError from '@/errors/AppError'
import NotFoundError from '@/errors/NotFoundError'
import UnauthorizedError from '@/errors/UnauthorizedError'

export default {
  register: catchPromise(async function (req, res, next) {
    const user = await new User({
      role: UserRole.USER,
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
    console.log('saved')

    return res.status(201).json({
      status: 'success',
    })
  }),
  login: catchPromise(async function (req, res, next) {
    const JwtSecretKey = process.env.JWT_SECRET_KEY as Secret
    const JwtExpiresIn = Number(process.env.JWT_EXPIRES_IN) || 0

    const user = await User.findOne({ email: req.body.email }).select('+password')

    if (!user) return next(new NotFoundError('User not found!'))

    if (!(await user.matchPassword(req.body.password))) return next(new UnauthorizedError('Incorrect password!'))

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      JwtSecretKey,
      {
        expiresIn: `${JwtExpiresIn}d`,
      },
    )

    return res
      .status(200)
      .cookie('jwt', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * JwtExpiresIn),
      })
      .json({
        status: 'success',
        data: {
          accessToken,
          user,
        },
      })
  }),

  // có thể tự logout bằng cách xóa cookie
  logout: catchPromise(async function (req, res, next) {
    return res.status(200).clearCookie('jwt').json({
      status: 'success',
    })
  }),
  changePassword: catchPromise(async function (req, res, next) {
    const authUser = (req as IRequestWithUser).user!
    const user: IUser = (await User.findOne({ id: authUser.id }))!

    if (!(await user.matchPassword(req.body.oldPassword))) {
      return next(new UnauthorizedError('Incorrect password!'))
    }
    console.log('old', req.body.oldPassword)
    console.log('new', req.body.newPassword)

    await user.setPassword(req.body.newPassword)
    user.save()

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  }),
  deleteProfile: catchPromise(async function (req, res, next) {
    const authUser = (req as IRequestWithUser).user!
    const user = await User.findByIdAndUpdate(authUser.id, { isDeleted: true, deletedAt: Date() }, {})

    return res.status(204).send()
  }),
}
