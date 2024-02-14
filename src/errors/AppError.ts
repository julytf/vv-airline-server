class AppError extends Error {
  errorCode: number
  status: string
  isOperational: boolean
  constructor(message: string = 'Unknown Error', errorCode: number = 500, isOperational = true) {
    super(message)

    this.errorCode = errorCode
    this.status = `${errorCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
