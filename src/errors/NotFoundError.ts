import AppError from './AppError'

class NotFoundError extends AppError {
  constructor(message: string = 'Not Found Error') {
    super(message, 404)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default NotFoundError
