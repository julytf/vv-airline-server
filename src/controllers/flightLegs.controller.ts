import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import FlightLeg from '@/models/flight/flightLeg.model'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Aircraft from '@/models/aircraft/aircraft.model'
import { addDays } from 'date-fns'

export default {
  getAllPaginate: factory.getAllPaginate(FlightLeg),
  getByDepartureTime: catchPromise(async (req: Request, res: Response, next: NextFunction) => {
    const { departureTime } = req.query as { departureTime: string }

    const flightLegs = await FlightLeg.find({
      departureTime: { $gte: new Date(departureTime), $lte: addDays(departureTime, 1) },
    })
    if (!flightLegs) {
      return next(new NotFoundError('FlightLegs not found'))
    }
    res.status(200).json({
      status: 'success',
      data: flightLegs,
    })
  }),
  getOne: factory.getOne(FlightLeg),
  createOne: factory.createOne(FlightLeg),
  updateOne: factory.updateOne(FlightLeg),
}
