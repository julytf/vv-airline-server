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

export default {
  getAllPaginate: factory.getAllPaginate(FlightLeg),
  getOne: factory.getOne(FlightLeg),
  createOne: factory.createOne(FlightLeg),
  updateOne: factory.updateOne(FlightLeg),
}
