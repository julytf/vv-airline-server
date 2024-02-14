import AppError from './AppError'

class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden Error') {
    super(message, 403)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ForbiddenError
