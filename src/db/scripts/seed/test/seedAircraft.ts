import { AircraftStatus } from '@/enums/aircraft.enums'
import { SeatStatus, SeatType } from '@/enums/seat.enums'
import { TicketClass, TicketType } from '@/enums/ticket.enums'
import { UserGender, UserRole } from '@/enums/user.enums'
import District from '@/models/address/district.model'
import Province from '@/models/address/province.model'
import Ward from '@/models/address/ward.model'
import Aircraft from '@/models/aircraft/aircraft.model'
import AircraftModel from '@/models/aircraft/aircraftModel.model'
import Seat from '@/models/aircraft/seat.model'
import MealPlan from '@/models/flight/mealPlan.model'
import Service from '@/models/flight/mealPlan.model'
import Surcharge from '@/models/flight/surcharge.model'
import User from '@/models/user.model'

export default async function seedAircraft() {
  await _seedAircraftModel()
  await _seedAircraft()
  await _seedSurcharge()
  await _seedMealPlan()
}

async function _seedAircraftModel() {
  let rowCount = 0

  await AircraftModel.create({
    name: 'Boing 787',
    seatQuantity: {
      [TicketClass.ECONOMY]: 300,
      [TicketClass.BUSINESS]: 120,
    },
    seatMap: [
      {
        class: TicketClass.BUSINESS,
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
                  ticketClass: TicketClass.BUSINESS,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
      {
        class: TicketClass.ECONOMY,
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
                  ticketClass: TicketClass.ECONOMY,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
      {
        class: TicketClass.ECONOMY,
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
                  ticketClass: TicketClass.ECONOMY,
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
      [TicketClass.ECONOMY]: 180,
      [TicketClass.BUSINESS]: 60,
    },
    seatMap: [
      {
        class: TicketClass.BUSINESS,
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
                  ticketClass: TicketClass.BUSINESS,
                  // surcharge: isWindowSeat ? 100 : 0,
                })
              }),
            ),
          })),
        ),
      },
      {
        class: TicketClass.ECONOMY,
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
                  ticketClass: TicketClass.ECONOMY,
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
    title: 'Phụ phí ghế - Ghế cửa sổ',
    name: `SeatType.${SeatType.WINDOW}`,
    value: 500_000,
  })

  await Surcharge.create({
    title: 'Phí hoàn vé - Phổ thông - Tiết kiệm',
    name: `TicketClass.${TicketClass.ECONOMY}.${TicketType.BUDGET}.Refund`,
    value: null,
  })
  // await Surcharge.create({
  //   title: 'Phí đổi vé - Phổ thông - Tiết kiệm',
  //   name: `TicketClass.${TicketClass.ECONOMY}.${TicketType.BUDGET}.Exchange`,
  //   value: null,
  // })

  await Surcharge.create({
    title: 'Phí hoàn vé - Phổ thông - Tiêu chuẩn',
    name: `TicketClass.${TicketClass.ECONOMY}.${TicketType.STANDARD}.Refund`,
    value: null,
  })
  // await Surcharge.create({
  //   title: 'Phí đổi vé - Phổ thông - Tiêu chuẩn',
  //   name: `TicketClass.${TicketClass.ECONOMY}.${TicketType.STANDARD}.Exchange`,
  //   value: 500_000,
  // })

  await Surcharge.create({
    title: 'Phí hoàn vé - Phổ thông - Linh hoạt',
    name: `TicketClass.${TicketClass.ECONOMY}.${TicketType.FLEXIBLE}.Refund`,
    value: 500_000,
  })
  // await Surcharge.create({
  //   title: 'Phí đổi vé - Phổ thông - Linh hoạt',
  //   name: `TicketClass.${TicketClass.ECONOMY}.${TicketType.FLEXIBLE}.Exchange`,
  //   value: 0,
  // })

  await Surcharge.create({
    title: 'Phí hoàn vé - Thương gia - Tiêu chuẩn',
    name: `TicketClass.${TicketClass.BUSINESS}.${TicketType.STANDARD}.Refund`,
    value: 500_000,
  })
  // await Surcharge.create({
  //   title: 'Phí đổi vé - Thương gia - Tiêu chuẩn',
  //   name: `TicketClass.${TicketClass.BUSINESS}.${TicketType.STANDARD}.Exchange`,
  //   value: 360_000,
  // })

  await Surcharge.create({
    title: 'Phí hoàn vé - Thương gia - Linh hoạt',
    name: `TicketClass.${TicketClass.BUSINESS}.${TicketType.FLEXIBLE}.Refund`,
    value: 360_000,
  })
  // await Surcharge.create({
  //   title: 'Phí đổi vé - Thương gia - Linh hoạt',
  //   name: `TicketClass.${TicketClass.BUSINESS}.${TicketType.FLEXIBLE}.Exchange`,
  //   value: 0,
  // })
}

async function _seedMealPlan() {
  await MealPlan.create({
    title: 'Đồ ăn Việt Nam',
    name: `do_an_viet_nam`,
    value: 0,
  })
  await MealPlan.create({
    title: 'Đồ ăn Pháp',
    name: `do_an_phap`,
    value: 0,
  })
  await MealPlan.create({
    title: 'Đồ ăn Thổ Nhĩ Kỳ',
    name: `do_an_tho_nhi_ky`,
    value: 0,
  })
  await MealPlan.create({
    title: 'Đồ ăn Nga',
    name: `do_an_nga`,
    value: 0,
  })
}
