import { AircraftStatus } from '@/enums/aircraft.enums'
import { SeatClass, SeatStatus, SeatType } from '@/enums/seat.enums'
import { UserGender, UserRole } from '@/enums/user.enums'
import District from '@/models/address/district.model'
import Province from '@/models/address/province.model'
import Ward from '@/models/address/ward.model'
import Aircraft from '@/models/aircraft/aircraft.model'
import AircraftModel from '@/models/aircraft/aircraftModel.model'
import Seat from '@/models/aircraft/seat.model'
import Surcharge from '@/models/flight/surcharge.model'
import User from '@/models/user.model'

export default async function seedAircraft() {
  await _seedAircraftModel()
  await _seedAircraft()
  await _seedSurcharge()
}

async function _seedAircraftModel() {
  let rowCount = 0

  await AircraftModel.create({
    name: 'Boing 787',
    seatQuantity: {
      [SeatClass.ECONOMY]: 300,
      [SeatClass.BUSINESS]: 120,
    },
    seatMap: [
      {
        class: SeatClass.BUSINESS,
        noRow: 20,
        noCol: 6,
        aisleCol: [2, 4],
        map: await Promise.all(
          new Array(20).fill(0).map(async (_, rowIndex) => ({
            index: rowCount++,
            hasExit: rowIndex % 10 === 0,
            seats: await Promise.all(
              new Array(6).fill(0).map(async (_, colIndex) => {
                const row = rowCount
                const col = String.fromCharCode(65 + colIndex)
                const code = `${row}${col}`

                const isWindowSeat = colIndex === 0 || colIndex === 5

                return await Seat.create({
                  code,
                  row,
                  col,
                  status: SeatStatus.AVAILABLE,
                  seatType: isWindowSeat ? SeatType.WINDOW : SeatType.NORMAL,
                  seatClass: SeatClass.BUSINESS,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
      {
        class: SeatClass.ECONOMY,
        noRow: 25,
        noCol: 6,
        aisleCol: [2, 4],
        map: await Promise.all(
          new Array(25).fill(0).map(async (_, rowIndex) => ({
            index: rowCount++,
            hasExit: rowIndex % 10 === 0,
            seats: await Promise.all(
              new Array(6).fill(0).map(async (_, colIndex) => {
                const row = rowCount
                const col = String.fromCharCode(65 + colIndex)
                const code = `${row}${col}`

                const isWindowSeat = colIndex === 0 || colIndex === 5

                return await Seat.create({
                  code,
                  row,
                  col,
                  status: SeatStatus.AVAILABLE,
                  seatType: isWindowSeat ? SeatType.WINDOW : SeatType.NORMAL,
                  seatClass: SeatClass.ECONOMY,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
      {
        class: SeatClass.ECONOMY,
        noRow: 25,
        noCol: 6,
        aisleCol: [2, 4],
        map: await Promise.all(
          new Array(25).fill(0).map(async (_, rowIndex) => ({
            index: rowCount++,
            hasExit: rowIndex % 10 === 0,
            seats: await Promise.all(
              new Array(6).fill(0).map(async (_, colIndex) => {
                const row = rowCount
                const col = String.fromCharCode(65 + colIndex)
                const code = `${row}${col}`

                const isWindowSeat = colIndex === 0 || colIndex === 5

                return await Seat.create({
                  code,
                  row,
                  col,
                  status: SeatStatus.AVAILABLE,
                  seatType: isWindowSeat ? SeatType.WINDOW : SeatType.NORMAL,
                  seatClass: SeatClass.ECONOMY,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
    ],
  })

  rowCount = 0
  await AircraftModel.create({
    name: 'Airbus A321',
    seatQuantity: {
      [SeatClass.ECONOMY]: 180,
      [SeatClass.BUSINESS]: 60,
    },
    seatMap: [
      {
        class: SeatClass.BUSINESS,
        noRow: 10,
        noCol: 6,
        aisleCol: [2, 4],
        map: await Promise.all(
          new Array(10).fill(0).map(async (_, rowIndex) => ({
            index: rowCount++,
            hasExit: rowIndex % 10 === 0,
            seats: await Promise.all(
              new Array(6).fill(0).map(async (_, colIndex) => {
                const row = rowCount
                const col = String.fromCharCode(65 + colIndex)
                const code = `${row}${col}`

                const isWindowSeat = colIndex === 0 || colIndex === 5

                return await Seat.create({
                  code,
                  row,
                  col,
                  status: SeatStatus.AVAILABLE,
                  seatType: isWindowSeat ? SeatType.WINDOW : SeatType.NORMAL,
                  seatClass: SeatClass.BUSINESS,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
      {
        class: SeatClass.ECONOMY,
        noRow: 30,
        noCol: 6,
        aisleCol: [2, 4],
        map: await Promise.all(
          new Array(30).fill(0).map(async (_, rowIndex) => ({
            index: rowCount++,
            hasExit: rowIndex % 10 === 0,
            seats: await Promise.all(
              new Array(6).fill(0).map(async (_, colIndex) => {
                const row = rowCount
                const col = String.fromCharCode(65 + colIndex)
                const code = `${row}${col}`

                const isWindowSeat = colIndex === 0 || colIndex === 5

                return await Seat.create({
                  code,
                  row,
                  col,
                  status: SeatStatus.AVAILABLE,
                  seatType: isWindowSeat ? SeatType.WINDOW : SeatType.NORMAL,
                  seatClass: SeatClass.ECONOMY,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
    ],
  })
}

async function _seedAircraft() {
  await Aircraft.create({
    registrationNumber: 'VN-217',
    name: 'VN 217',
    status: AircraftStatus.ACTIVE,
    aircraftModel: await AircraftModel.findOne({ name: 'Boing 787' }),
  })
  await Aircraft.create({
    registrationNumber: 'VN-11',
    name: 'VN 11',
    status: AircraftStatus.ACTIVE,
    aircraftModel: await AircraftModel.findOne({ name: 'Airbus A321' }),
  })
}

async function _seedSurcharge() {
  await Surcharge.create({
    name: `SeatType.${SeatType.WINDOW}`,
    value: 500_000,
  })
}
