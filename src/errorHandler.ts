import { ErrorRequestHandler } from 'express'
import AppError from './errors/AppError'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)
  if (err instanceof AppError) {
    return res.status(err.errorCode).json({
      status: 'error',
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  })
}

export default errorHandler
