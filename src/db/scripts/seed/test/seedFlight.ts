import { FlightLegStatus } from '@/enums/flightLeg.enums'
import District from '@/models/address/district.model'
import Province from '@/models/address/province.model'
import Ward from '@/models/address/ward.model'
import Airport from '@/models/flight/airport.model'
import Flight from '@/models/flight/flight.model'
import FlightLeg from '@/models/flight/flightLeg.model'
import FlightRoute from '@/models/flight/flightRoute.model'
import User from '@/models/user.model'

export default async function seedFlight() {
  await _seedAirport()
  await _seedFlightRoute()
  await _seedFlight()
}

async function _seedAirport() {
  await Airport.create({
    name: 'Hà Nội',
    description: null,
    longitude: null,
    latitude: null,
    address: {
      address: 'sân bay Hà Nội',
      ward: await Ward.findOne({ codeName: 'cau_dien' }),
      district: await District.findOne({ codeName: 'nam_tư_liem' }),
      province: await Province.findOne({ codeName: 'ha_noi' }),
    },
  })
  await Airport.create({
    name: 'Cần Thơ',
    description: null,
    longitude: null,
    latitude: null,
    address: {
      address: 'sân bay Cần Thơ',
      ward: await Ward.findOne({ codeName: 'xuan_khanh' }),
      district: await District.findOne({ codeName: 'ninh_kieu' }),
      province: await Province.findOne({ codeName: 'can_tho' }),
    },
  })
  await Airport.create({
    name: 'Hồ Chí Minh',
    description: null,
    longitude: null,
    latitude: null,
    address: {
      address: 'sân bay Hồ Chí Minh',
      ward: await Ward.findOne({ codeName: 'tan_dinh' }),
      district: await District.findOne({ codeName: '1' }),
      province: await Province.findOne({ codeName: 'ho_chi_minh' }),
    },
  })
}

async function _seedFlightRoute() {
  await FlightRoute.create({
    distance: 50,
    prices: [
      {
        value: 500_000,
        seatClass: 'ECONOMY',
      },
      {
        value: 1_000_000,
        seatClass: 'BUSINESS',
      },
    ],
    departureAirport: await Airport.findOne({ name: 'Hà Nội' }),
    destinationAirport: await Airport.findOne({ name: 'Cần Thơ' }),
  })
  await FlightRoute.create({
    distance: 50,
    prices: [
      {
        value: 500_000,
        seatClass: 'ECONOMY',
      },
      {
        value: 1_000_000,
        seatClass: 'BUSINESS',
      },
    ],
    departureAirport: await Airport.findOne({ name: 'Cần Thơ' }),
    destinationAirport: await Airport.findOne({ name: 'Hồ Chí Minh' }),
  })
  await FlightRoute.create({
    distance: 100,
    prices: [
      {
        value: 1_000_000,
        seatClass: 'ECONOMY',
      },
      {
        value: 2_000_000,
        seatClass: 'BUSINESS',
      },
    ],
    departureAirport: await Airport.findOne({ name: 'Hà Nội' }),
    destinationAirport: await Airport.findOne({ name: 'Hồ Chí Minh' }),
  })
  await FlightRoute.create({
    distance: 100,
    prices: [
      {
        value: 1_000_000,
        seatClass: 'ECONOMY',
      },
      {
        value: 2_000_000,
        seatClass: 'BUSINESS',
      },
    ],
    departureAirport: await Airport.findOne({ name: 'Hồ Chí Minh' }),
    destinationAirport: await Airport.findOne({ name: 'Hà Nội' }),
  })
}

async function _seedFlight() {
  // flight routes
  const HanoiAirport = await Airport.findOne({ name: 'Hà Nội' });
  const HCMAirport = await Airport.findOne({ name: 'Hồ Chí Minh' });
  const CanThoAirport = await Airport.findOne({ name: 'Cần Thơ' });

  const HNToHCMFlightRoute = await FlightRoute.findOne({
    departureAirport: HanoiAirport,
    destinationAirport: HCMAirport,
  });

  const HNToCanThoFlightRoute = await FlightRoute.findOne({
    departureAirport: HanoiAirport,
    destinationAirport: CanThoAirport,
  });

  const CanThoToHCMFlightRoute = await FlightRoute.findOne({
    departureAirport: CanThoAirport,
    destinationAirport: HCMAirport,
  });

  const HCMToHNFlightRoute = await FlightRoute.findOne({
    departureAirport: HCMAirport,
    destinationAirport: HanoiAirport,
  });

  // flight legs
  const HNToHCMFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-01 08:00:00'),
    arrivalTime: new Date('2024-01-01 10:00:00'),
    remainingSeats: 120,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: HNToHCMFlightRoute,
  })

  const HNToCanThoFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-01 16:00:00'),
    arrivalTime: new Date('2024-01-01 18:00:00'),
    remainingSeats: 80,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: HNToCanThoFlightRoute,
  })

  const CanThoToHCMFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-01 20:00:00'),
    arrivalTime: new Date('2024-01-01 22:00:00'),
    remainingSeats: 90,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: CanThoToHCMFlightRoute,
  })

  const HCMToHNFlightLeg = await FlightLeg.create({
    departureTime: new Date('2024-01-02 12:00:00'),
    arrivalTime: new Date('2024-01-02 14:00:00'),
    remainingSeats: 100,
    status: FlightLegStatus.AVAILABLE,
    flightRoute: HCMToHNFlightRoute,
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
