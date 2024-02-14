import AppError from './AppError'

class ValidationError extends AppError {
  constructor(message: string = 'Validation Error') { 
    super(message, 422)
    Error.captureStackTrace(this, this.constructor)
  } 
}

export default ValidationError 
