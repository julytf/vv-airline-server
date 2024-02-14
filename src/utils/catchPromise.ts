import { NextFunction, Request, RequestHandler, Response } from 'express'

const catchPromise = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export default catchPromise
