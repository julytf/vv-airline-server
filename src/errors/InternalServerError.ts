import AppError from './AppError'

class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default InternalServerError
