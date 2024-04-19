import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import Flight from '@/models/flight/flight.model'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Aircraft from '@/models/aircraft/aircraft.model'
import { FlightLegType } from '@/enums/flightLeg.enums'
import FlightLeg from '@/models/flight/flightLeg.model'

export default {
  getAllPaginate: factory.getAllPaginate(Flight),
  getOne: factory.getOne(Flight),
  createOne: catchPromise(async (req: Request, res: Response, next: NextFunction) => {
    const departureFlightLegID = req.body.flightLegs?.[FlightLegType.DEPARTURE]
    const transitFlightLegID = req.body.flightLegs?.[FlightLegType.TRANSIT]

    const flight = new Flight({
      flightLegs: {
        [FlightLegType.DEPARTURE]: departureFlightLegID,
        [FlightLegType.TRANSIT]: departureFlightLegID,
      },
    })

    await flight.autoFillDataWithFlightLegsData()
    flight.save()

    res.status(201).json({
      status: 'success',
      data: flight,
    })
  }),
  updateOne: factory.updateOne(Flight),
}
