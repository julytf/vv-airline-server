import AppError from './AppError'

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized Error') {
    super(message, 401)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default UnauthorizedError
