import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'
import catchPromise from '@/utils/catchPromise'
import IRequestWithUser from '@/interfaces/IRequestWithUser'
import Flight from '@/models/flight/flight.model'
import FlightRoute, { IFlightRoute } from '@/models/flight/flightRoute.model'
import Airport from '@/models/flight/airport.model'
import FlightLeg, { IFlightLeg } from '@/models/flight/flightLeg.model'
import { populate } from 'dotenv'
import { endOfDay, startOfDay } from 'date-fns'
import path from 'path'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { SeatClass } from '@/enums/seat.enums'

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
    const { departureAirportIATA, arrivalAirportIATA, departureDate, totalPassengers } = req.query as {
      departureAirportIATA: string
      arrivalAirportIATA: string
      departureDate: string
      totalPassengers: string
    }

    // console.log('departureAirportIATA', departureAirportIATA)
    // console.log('arrivalAirportIATA', arrivalAirportIATA)
    // console.log('departureDate', departureDate)
    // console.log('adults', adults)

    if (!departureAirportIATA || !arrivalAirportIATA || !departureDate || !totalPassengers) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields',
      })
    }

    // TODO: check enough slots for passengers

    const departureAirport = await Airport.findOne({ IATA: departureAirportIATA })
    const arrivalAirport = await Airport.findOne({ IATA: arrivalAirportIATA })

    const flightRoute = await FlightRoute.findOne({
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
    })
    console.log(Number(totalPassengers))

    const flights = await Flight.find({
      $or: [
        {
          flightRoute,
          departureDate: {
            $gte: startOfDay(departureDate),
            $lte: endOfDay(departureDate),
          },
          [`remainingSeats.${SeatClass.ECONOMY}`]: { $gte: Number(totalPassengers) },
        },
        {
          flightRoute,
          departureDate: {
            $gte: startOfDay(departureDate),
            $lte: endOfDay(departureDate),
          },
          [`remainingSeats.${SeatClass.BUSINESS}`]: { $gte: Number(totalPassengers) },
        },
      ],
    }).populate([
      {
        path: 'flightRoute',
        populate: [{ path: 'departureAirport' }, { path: 'arrivalAirport' }],
      },
      {
        path: 'flightLegs',
        populate: [
          {
            path: FlightLegType.DEPARTURE,
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
          {
            path: FlightLegType.TRANSIT,
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
        ],
      },
    ])

    return res.status(200).json({
      status: 'success',
      data: flights,
    })
  }),
}
