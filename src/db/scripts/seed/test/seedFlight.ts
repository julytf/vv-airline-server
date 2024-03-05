import { FlightLegStatus } from '@/enums/flightLeg.enums'
import Country from '@/models/address/country.model'
import District from '@/models/address/district.model'
import Province from '@/models/address/province.model'
import Ward from '@/models/address/ward.model'
import Aircraft from '@/models/aircraft/aircraft.model'
import Airport from '@/models/flight/airport.model'
import Flight from '@/models/flight/flight.model'
import FlightLeg from '@/models/flight/flightLeg.model'
import FlightRoute from '@/models/flight/flightRoute.model'
import User from '@/models/user.model'
import readJsonFile from '@/utils/readJsonFile'

export default async function seedFlight() {
  await _seedAirport()
  await _seedFlightRoute()
  await _seedFlight()
}

async function _seedAirport() {
  // await Airport.create({
  //   name: 'Hà Nội',
  //   description: null,
  //   longitude: null,
  //   latitude: null,
  //   address: {
  //     address: 'sân bay Hà Nội',
  //     ward: await Ward.findOne({ codeName: 'cau_dien' }),
  //     district: await District.findOne({ codeName: 'nam_tư_liem' }),
  //     province: await Province.findOne({ codeName: 'ha_noi' }),
  //   },
  // })
  // await Airport.create({
  //   name: 'Cần Thơ',
  //   description: null,
  //   longitude: null,
  //   latitude: null,
  //   address: {
  //     address: 'sân bay Cần Thơ',
  //     ward: await Ward.findOne({ codeName: 'xuan_khanh' }),
  //     district: await District.findOne({ codeName: 'ninh_kieu' }),
  //     province: await Province.findOne({ codeName: 'can_tho' }),
  //   },
  // })
  // await Airport.create({
  //   name: 'Hồ Chí Minh',
  //   description: null,
  //   longitude: null,
  //   latitude: null,
  //   address: {
  //     address: 'sân bay Hồ Chí Minh',
  //     ward: await Ward.findOne({ codeName: 'tan_dinh' }),
  //     district: await District.findOne({ codeName: '1' }),
  //     province: await Province.findOne({ codeName: 'ho_chi_minh' }),
  //   },
  // })

  const airportsJson = (await readJsonFile('src/db/data/airports.json')) as object[]

  const airports = await Promise.all(
    airportsJson.map(
      async (airport: object) =>
        await Airport.create({
          ...airport,
          country: await Country.findOne({ code: (airport as any).countryCode }),
        }),
    ),
  )
}

async function _seedFlightRoute() {
  const haNoiAirport = await Airport.findOne({ IATA: 'HAN' })
  const canThoAirport = await Airport.findOne({ IATA: 'VCA' })
  const hoChiMinhAirport = await Airport.findOne({ IATA: 'SGN' })

  await FlightRoute.create({
    distance: 50,
    prices: {
      ECONOMY: 500_000,
      BUSINESS: 1_000_000,
    },
    departureAirport: haNoiAirport,
    arrivalAirport: canThoAirport,
  })
  await FlightRoute.create({
    distance: 50,
    prices: {
      ECONOMY: 500_000,
      BUSINESS: 1_000_000,
    },
    departureAirport: canThoAirport,
    arrivalAirport: hoChiMinhAirport,
  })
  await FlightRoute.create({
    distance: 100,
    prices: {
      ECONOMY: 1_000_000,
      BUSINESS: 2_000_000,
    },
    departureAirport: haNoiAirport,
    arrivalAirport: hoChiMinhAirport,
  })
  await FlightRoute.create({
    distance: 100,
    prices: {
      ECONOMY: 1_000_000,
      BUSINESS: 2_000_000,
    },
    departureAirport: hoChiMinhAirport,
    arrivalAirport: haNoiAirport,
  })
}

async function _seedFlight() {
  const aircraftVN217 = await Aircraft.findOne({ registrationNumber: 'VN-217' })
  const aircraftVN11 = await Aircraft.findOne({ registrationNumber: 'VN-11' })

  // flight routes
  const haNoiAirport = await Airport.findOne({ IATA: 'HAN' })
  const canThoAirport = await Airport.findOne({ IATA: 'VCA' })
  const hoChiMinhAirport = await Airport.findOne({ IATA: 'SGN' })

  const HNToHCMFlightRoute = await FlightRoute.findOne({
    departureAirport: haNoiAirport,
    arrivalAirport: hoChiMinhAirport,
  })

  const HNToCanThoFlightRoute = await FlightRoute.findOne({
    departureAirport: haNoiAirport,
    arrivalAirport: canThoAirport,
  })

  const CanThoToHCMFlightRoute = await FlightRoute.findOne({
    departureAirport: canThoAirport,
    arrivalAirport: hoChiMinhAirport,
  })

  const HCMToHNFlightRoute = await FlightRoute.findOne({
    departureAirport: hoChiMinhAirport,
    arrivalAirport: haNoiAirport,
  })

  // flight legs
  const HNToHCMFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-01 08:00:00'),
    arrivalTime: new Date('2024-01-01 10:00:00'),
    remainingSeats: 120,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: HNToHCMFlightRoute,
    aircraft: aircraftVN217,
  })

  const HNToCanThoFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-01 16:00:00'),
    arrivalTime: new Date('2024-01-01 18:00:00'),
    remainingSeats: 80,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: HNToCanThoFlightRoute,
    aircraft: aircraftVN11,
  })

  const CanThoToHCMFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-01 20:00:00'),
    arrivalTime: new Date('2024-01-01 22:00:00'),
    remainingSeats: 90,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: CanThoToHCMFlightRoute,
    aircraft: aircraftVN11,
  })

  const HCMToHNFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-02 12:00:00'),
    arrivalTime: new Date('2024-01-02 14:00:00'),
    remainingSeats: 100,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: HCMToHNFlightRoute,
    aircraft: aircraftVN217,
  })

  // flights
  const HNToHCMFlightNoTransit = await Flight.create({
    hasTransit: false,
    departureTime: new Date('2024-01-01 16:00:00'),
    arrivalTime: new Date('2024-01-01 18:00:00'),
    remainingSeats: 120,
    flightRoute: HNToHCMFlightRoute,
    flightLegs: [HNToCanThoFlightLeg],
  })

  const HNToHCMFlightHasTransit = await Flight.create({
    hasTransit: true,
    departureTime: new Date('2024-01-01 16:00:00'),
    arrivalTime: new Date('2024-01-01 22:00:00'),
    remainingSeats: 100,
    flightRoute: HNToHCMFlightRoute,
    flightLegs: [HNToCanThoFlightLeg, CanThoToHCMFlightLeg],
  })

  const HCMToHNFlight = await Flight.create({
    hasTransit: false,
    departureTime: new Date('2024-01-02 12:00:00'),
    arrivalTime: new Date('2024-01-02 14:00:00'),
    remainingSeats: 100,
    flightRoute: HCMToHNFlightRoute,
    flightLegs: [HCMToHNFlightLeg],
  })
}
