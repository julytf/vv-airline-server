import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Aircraft from '@/models/aircraft/aircraft.model'
import AircraftModel from '@/models/aircraft/aircraftModel.model'

export default {
  getAllPaginate: factory.getAllPaginate(AircraftModel),
  getOne: factory.getOne(AircraftModel),
  createOne: factory.createOne(AircraftModel),
  updateOne: factory.updateOne(AircraftModel),
}
