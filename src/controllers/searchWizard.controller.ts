import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import Flight from '@/models/flight/flight.model'
import FlightRoute from '@/models/flight/flightRoute.model'
import Airport from '@/models/flight/airport.model'
import FlightLeg from '@/models/flight/flightLeg.model'
import { populate } from 'dotenv'
import { endOfDay, startOfDay } from 'date-fns'
import path from 'path'

const stripe = new Stripe(config.stripe.secretKey)

export default {
  // getFlightRoutes: factory.getAll(FlightRoute),
  getAirports: factory.getAll(Airport),

  getAirport: catchPromise(async function (req, res, next) {
    const IATA = req.query.IATA as string

    const airport = await Airport.findOne({ IATA: IATA })

    return res.status(200).json({
      status: 'success',
      data: airport,
    })
  }),

  getFlights: catchPromise(async function (req, res, next) {
    const { departureAirportIATA, arrivalAirportIATA, departureDate } = req.query as {
      departureAirportIATA: string
      arrivalAirportIATA: string
      departureDate: string
    }
    const adults = req.query['passengersAdults']
    const children = req.query['passengersChildren']

    console.log('departureAirportIATA', departureAirportIATA)
    console.log('arrivalAirportIATA', arrivalAirportIATA)
    console.log('departureDate', departureDate)
    console.log('adults', adults)

    if (!departureAirportIATA || !arrivalAirportIATA || !departureDate || !adults) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields',
      })
    }

    // TODO: check enough slots for passengers
    const totalPassengers = parseInt(adults as string) + parseInt(children as string)

    const departureAirport = await Airport.findOne({ IATA: departureAirportIATA })
    const arrivalAirport = await Airport.findOne({ IATA: arrivalAirportIATA })

    const flightRoute = await FlightRoute.findOne({
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
    })

    const flights = await Flight.find({
      flightRoute,
      departureDate: {
        $gte: startOfDay(departureDate),
        $lte: endOfDay(departureDate),
      },
    }).populate([
      {
        path: 'flightRoute',
        populate: [{ path: 'departureAirport' }, { path: 'arrivalAirport' }],
      },
      {
        path: 'flightLegs',
        populate: [
          { path: 'flightRoute', populate: [{ path: 'departureAirport' }, { path: 'arrivalAirport' }] },
          {
            path: 'aircraft',
            populate: [
              {
                path: 'aircraftModel',
                populate: {
                  path: 'seatMap.map.seats',
                },
              },
            ],
          },
        ],
      },
    ])

    return res.status(200).json({
      status: 'success',
      data: flights,
    })
  }),
}
