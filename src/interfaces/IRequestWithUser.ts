import { IUser } from '@/models/user.model'
import { Request } from 'express'

export default interface IRequestWithUser extends Request {
  user?: IUser
}
