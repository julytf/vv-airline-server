import { NextFunction, Request, RequestHandler, Response } from 'express'

import User, { IUser } from '@/models/user.model'
import AppError from '@/errors/AppError'
import jwt, { JwtPayload } from 'jsonwebtoken'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import UnauthorizedError from '@/errors/UnauthorizedError'

interface AuthData extends JwtPayload {
  id: string
}

const auth = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) return next()

  const token = req.headers?.authorization?.replace('Bearer ', '') || req.cookies.jwt

  if (!token) return next(new UnauthorizedError())

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as AuthData
  } catch (err) {
    return next(err)
  }
  const user = await User.findById(decoded.id).select('+password')
  console.log('auth', user?.id)

  if (!user) return next(new UnauthorizedError())

  req.user = user

  return next()
}

export default auth
