import AppError from './AppError'

class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request Error') {
    super(message, 400)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default BadRequestError
