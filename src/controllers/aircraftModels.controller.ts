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
import AircraftModel, { IAircraftModel } from '@/models/aircraft/aircraftModel.model'
import { TicketClass } from '@/enums/ticket.enums'
import Seat, { ISeat } from '@/models/aircraft/seat.model'
import { SeatStatus } from '@/enums/seat.enums'

export default {
  getAllPaginate: factory.getAllPaginate(AircraftModel),
  getAll: factory.getAll(AircraftModel),
  getOne: factory.getOne(AircraftModel),
  createOne: catchPromise(async function (req, res, next) {
    // res.status(201).json({
    //   status: 'success',
    //   data: req.body,
    // })

    const aircraftModelData = req.body as IAircraftModel

    const economySeatsQuantity = aircraftModelData.seatMap
      ?.map((cabin) => {
        if (cabin.class !== TicketClass.ECONOMY) return 0
        return cabin.map
          .map((row) => row.seats.filter((seat) => (seat as unknown as ISeat).status === SeatStatus.AVAILABLE).length)
          .reduce((a, b) => a + b, 0)
      })
      .reduce((a, b) => a + b, 0)
    const businessSeatsQuantity = aircraftModelData.seatMap
      ?.map((cabin) => {
        if (cabin.class !== TicketClass.BUSINESS) return 0
        return cabin.map
          .map((row) => row.seats.filter((seat) => (seat as unknown as ISeat).status === SeatStatus.AVAILABLE).length)
          .reduce((a, b) => a + b, 0)
      })
      .reduce((a, b) => a + b, 0)

    // let index = 0

    await Promise.all(
      aircraftModelData.seatMap.map(async (cabin) => {
        await Promise.all(
          cabin.map.map(async (row) => {
            console.log(row.seats)
            // row.index = index++
            row.seats = await Promise.all(
              row.seats.map(async (seat) => {
                const newSeat = await Seat.create(seat)
                return newSeat._id
              }),
            )
          }),
        )
      }),
    )
    // console.log(aircraftModelData)
    // res.status(201).json({
    //   status: 'success',
    //   data: aircraftModelData,
    // })

    const aircraftModel = new AircraftModel(
      // <
      //   IAircraftModel & {
      //     seatMap: {
      //       class: TicketClass
      //       noRow: number
      //       noCol: number
      //       aisleCol: number[]
      //       map: {
      //         index: number
      //         hasExit: boolean
      //         seats: ISeat[]
      //       }[]
      //     }[]
      //   }
      // >
      aircraftModelData,
    )

    // res.status(201).json({
    //   status: 'success',
    //   data: aircraftModel,
    // })

    aircraftModel.seatQuantity = {
      [TicketClass.ECONOMY]: economySeatsQuantity,
      [TicketClass.BUSINESS]: businessSeatsQuantity,
    }
    // await Promise.all(
    //   aircraftModel.seatMap.map(async (cabin) => {
    //     await Promise.all(
    //       cabin.map.map(async (row) => {
    //         console.log(row.seats)
    //         row.seats = await Promise.all(
    //           row.seats.map(async (seat) => {
    //             const newSeat = await Seat.create(seat)
    //             return newSeat._id
    //           }),
    //         )
    //       }),
    //     )
    //   }),
    // )
    // console.log(aircraftModel)

    // for (let i = 0; i < aircraftModel.seatMap.length; i++) {
    //   let cabin = aircraftModel.seatMap[i]
    //   for (let j = 0; j < cabin.map.length; j++) {
    //     let row = cabin.map[j]
    //     const seatIds = []
    //     for (let k = 0; k < row.seats.length; k++) {
    //       const seat = row.seats[k]
    //       console.log('here')
    //       const newSeat = await Seat.create(seat)
    //       seatIds.push(newSeat._id)
    //       console.log(newSeat._id)
    //     }
    //     row.seats = seatIds
    //   }
    // }

    // for await (let cabin of aircraftModel.seatMap) {
    //   for await (let row of cabin.map) {
    //     const seatIds = []
    //     for await (let seat of row.seats) {
    //       console.log('here')
    //       const newSeat = await Seat.create(seat)
    //       seatIds.push(newSeat._id)
    //       console.log(newSeat._id)
    //     }
    //     row.seats = seatIds
    //   }
    // }

    await aircraftModel.save()

    res.status(201).json({
      status: 'success',
      data: aircraftModel,
    })
  }),
  updateOne: catchPromise(async function (req, res, next) {
    const { id } = req.params as { id: string }

    const aircraftModel = await AircraftModel.findById(id)

    if (!aircraftModel) throw new NotFoundError('No document found!')

    const aircraftModelData = req.body as IAircraftModel

    const economySeatsQuantity = aircraftModelData.seatMap
      ?.map((cabin) => {
        if (cabin.class !== TicketClass.ECONOMY) return 0
        return cabin.map
          .map((row) => row.seats.filter((seat) => (seat as unknown as ISeat).status === SeatStatus.AVAILABLE).length)
          .reduce((a, b) => a + b, 0)
      })
      .reduce((a, b) => a + b, 0)
    const businessSeatsQuantity = aircraftModelData.seatMap
      ?.map((cabin) => {
        if (cabin.class !== TicketClass.BUSINESS) return 0
        return cabin.map
          .map((row) => row.seats.filter((seat) => (seat as unknown as ISeat).status === SeatStatus.AVAILABLE).length)
          .reduce((a, b) => a + b, 0)
      })
      .reduce((a, b) => a + b, 0)

    await Promise.all(
      aircraftModelData.seatMap.map(async (cabin) => {
        await Promise.all(
          cabin.map.map(async (row) => {
            console.log(row.seats)
            row.seats = await Promise.all(
              row.seats.map(async (seat) => {
                const newSeat = await Seat.create(seat)
                return newSeat._id
              }),
            )
          }),
        )
      }),
    )
    console.log(aircraftModelData.seatMap[0].map[1])
    // res.status(201).json({
    //   status: 'success',
    //   data: aircraftModelData,
    // })

    // const aircraftModel = new AircraftModel(
    //   // <
    //   //   IAircraftModel & {
    //   //     seatMap: {
    //   //       class: TicketClass
    //   //       noRow: number
    //   //       noCol: number
    //   //       aisleCol: number[]
    //   //       map: {
    //   //         index: number
    //   //         hasExit: boolean
    //   //         seats: ISeat[]
    //   //       }[]
    //   //     }[]
    //   //   }
    //   // >
    //   aircraftModelData,
    // )

    // =>>
    await AircraftModel.updateOne({ _id: id }, aircraftModelData)

    // res.status(201).json({
    //   status: 'success',
    //   data: aircraftModel,
    // })

    aircraftModel.seatQuantity = {
      [TicketClass.ECONOMY]: economySeatsQuantity,
      [TicketClass.BUSINESS]: businessSeatsQuantity,
    }
    // await Promise.all(
    //   aircraftModel.seatMap.map(async (cabin) => {
    //     await Promise.all(
    //       cabin.map.map(async (row) => {
    //         console.log(row.seats)
    //         row.seats = await Promise.all(
    //           row.seats.map(async (seat) => {
    //             const newSeat = await Seat.create(seat)
    //             return newSeat._id
    //           }),
    //         )
    //       }),
    //     )
    //   }),
    // )
    // console.log(aircraftModel)

    // for (let i = 0; i < aircraftModel.seatMap.length; i++) {
    //   let cabin = aircraftModel.seatMap[i]
    //   for (let j = 0; j < cabin.map.length; j++) {
    //     let row = cabin.map[j]
    //     const seatIds = []
    //     for (let k = 0; k < row.seats.length; k++) {
    //       const seat = row.seats[k]
    //       console.log('here')
    //       const newSeat = await Seat.create(seat)
    //       seatIds.push(newSeat._id)
    //       console.log(newSeat._id)
    //     }
    //     row.seats = seatIds
    //   }
    // }

    // for await (let cabin of aircraftModel.seatMap) {
    //   for await (let row of cabin.map) {
    //     const seatIds = []
    //     for await (let seat of row.seats) {
    //       console.log('here')
    //       const newSeat = await Seat.create(seat)
    //       seatIds.push(newSeat._id)
    //       console.log(newSeat._id)
    //     }
    //     row.seats = seatIds
    //   }
    // }

    await aircraftModel.save()

    res.status(201).json({
      status: 'success',
      data: aircraftModel,
    })
  }),
}
