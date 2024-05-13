import IRequestWithUser from '@/interfaces/IRequestWithUser'
import { UserRole, UserStatus } from '@/enums/user.enums'
import User, { IUser } from '@/models/user.model'
import catchPromise from '@/utils/catchPromise'
import jwt, { Secret } from 'jsonwebtoken'
import { Request } from 'express'
import AppError from '@/errors/AppError'
import NotFoundError from '@/errors/NotFoundError'
import UnauthorizedError from '@/errors/UnauthorizedError'
import { sendEmail } from '@/utils/email'

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
    // console.log('saved')

    return res.status(201).json({
      status: 'success',
    })
  }),
  login: catchPromise(async function (req, res, next) {
    const JwtSecretKey = process.env.JWT_SECRET_KEY as Secret
    const JwtExpiresIn = Number(process.env.JWT_EXPIRES_IN) || 0

    const user = await User.findOne({ email: req.body.email }).select('+password')

    if (!user) return next(new NotFoundError('User not found!'))
    // console.log(req.body)

    if (!(await user.matchPassword(req.body.password))) return next(new UnauthorizedError('Incorrect password!'))

    const accessToken = jwt.sign(
      {
        id: user._id,
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
    // console.log('old', req.body.oldPassword)
    // console.log('new', req.body.newPassword)

    const authUser = (req as IRequestWithUser).user!
    const user: IUser = (await User.findById(authUser._id))!

    if (!(await user.matchPassword(req.body.oldPassword))) {
      return next(new UnauthorizedError('Incorrect password!'))
    }

    await user.setPassword(req.body.newPassword)
    await user.save()

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  }),
  deleteProfile: catchPromise(async function (req, res, next) {
    const authUser = (req as IRequestWithUser).user!
    const user = await User.findByIdAndUpdate(authUser._id, { isDeleted: true, deletedAt: Date() }, {})

    return res.status(204).send()
  }),

  // reset password routes
  requestResetPasswordOTPEmail: catchPromise(async function (req, res, next) {
    // send email with otp

    const user = await User.findOne({ email: req.body.email })

    if (!user) return next(new NotFoundError('User not found!'))

    const token = user.createResetToken()
    await user.save()

    console.log('token', token)

    sendEmail({
      email: user.email,
      subject: 'VV Airline - Mã OTP đổi mật khẩu',
      message: `Mã OTP của bạn là: ${token}`,
    })

    return res.status(200).json({
      status: 'success',
    })
  }),

  verifyOTP: catchPromise(async function (req, res, next) {
    const OTP = req.body.OTP
    const user = await User.findOne({ email: req.body.email })

    if (
      !user?.resetToken?.token ||
      user?.resetToken?.token !== OTP ||
      !user?.resetToken?.expires ||
      user?.resetToken?.expires < new Date()
    )
      return next(new AppError('Invalid OTP', 400))

    // if otp valid, return 200
    return res.status(200).json({
      status: 'success',
    })
  }),

  resetPasswordWithOTP: catchPromise(async function (req, res, next) {
    const OTP = req.body.OTP
    const newPassword = req.body.newPassword
    const user = await User.findOne({ email: req.body.email })

    if (
      !user?.resetToken?.token ||
      user?.resetToken?.token !== OTP ||
      !user?.resetToken?.expires ||
      user?.resetToken?.expires < new Date()
    )
      return next(new AppError('Invalid OTP', 400))

    user.resetToken = undefined
    await user.setPassword(newPassword)
    await user.save()

    return res.status(200).json({
      status: 'success',
    })
  }),
}
