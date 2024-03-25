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

export default {
  getAllPaginate: factory.getAllPaginate(Flight),
  getOne: factory.getOne(Flight),
  createOne: factory.createOne(Flight),
  updateOne: factory.updateOne(Flight),
}
