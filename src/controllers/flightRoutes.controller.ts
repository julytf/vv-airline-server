import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import FlightRoute from '@/models/flight/flightRoute.model'
import AdjustQuery from '@/utils/adjustQuery'
import NotFoundError from '@/errors/NotFoundError'
import Aircraft from '@/models/aircraft/aircraft.model'

export default {
  // getAllPaginate: catchPromise(async function (req, res, next) {
  //   const { sort = false, page = 1, perPage = 20, q = '' } = req.query

  //   const query = new AdjustQuery(
  //     FlightRoute.find().populate([
  //       {
  //         path: 'departureAirport',
  //       },
  //       {
  //         path: 'arrivalAirport',
  //       },
  //     ]),
  //   )
  //     .nameFilter(q as string)
  //     .paginate(page as number, perPage as number)
  //     .sort('-createdAt').query
  //   const docs = await query

  //   if (!docs) throw new NotFoundError('No document found!')

  //   // docs.forEach(doc => doc?.completeImagesUrl())

  //   const count = await new AdjustQuery(FlightRoute.find()).nameFilter(q as string).query.countDocuments()
  //   const lastPage = Math.ceil(count / (perPage as number))
  //   // console.log('lastPage', lastPage);
  //   // console.log('count', count);
  //   // console.log('perPage', perPage);

  //   return res.status(200).json({
  //     status: 'success',
  //     data: {
  //       totalDocs: docs.length,
  //       lastPage,
  //       page,
  //       perPage,
  //       docs,
  //     },
  //   })
  // }),
  // getOne: catchPromise(async function (req, res, next) {
  //   const doc = await FlightRoute.findById(req.params.id).populate([
  //     {
  //       path: 'departureAirport',
  //     },
  //     {
  //       path: 'arrivalAirport',
  //     },
  //   ])
  //   console.log(req.params.id)

  //   if (!doc) throw new NotFoundError('No document found!')

  //   return res.status(200).json({
  //     status: 'success',
  //     data: { doc },
  //   })
  // }),
  getAllPaginate: factory.getAllPaginate(FlightRoute),
  getAll: factory.getAll(FlightRoute),
  getOne: factory.getOne(FlightRoute),
  createOne: factory.createOne(FlightRoute),
  updateOne: factory.updateOne(FlightRoute),
}
