import { FlightType } from '@/enums/flight.enums'
import { FlightLegType } from '@/enums/flightLeg.enums'
import { PaymentMethod, PaymentStatus } from '@/enums/payment.enums'
import { TicketClass, TicketType } from '@/enums/ticket.enums'
import { model, PreMiddlewareFunction, Schema, Types } from 'mongoose'
import Reservation from './reservation.model'
import { PassengerType } from '@/enums/passenger.enums'

export interface IBooking {
  passengersQuantity: {
    [PassengerType.ADULT]: number
    [PassengerType.CHILD]: number
  }
  isRoundtrip: boolean
  totalPrice: number
  user?: Types.ObjectId
  contactInfo: {
    email: string
    phoneNumber: string
  }
  passengers: Types.ObjectId[]
  flightsInfo: {
    [FlightType.OUTBOUND]: {
      flight: Types.ObjectId
      ticketClass: TicketClass
      ticketType: TicketType
      price: number
      reservations: {
        [FlightLegType.DEPARTURE]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
        [FlightLegType.TRANSIT]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
      }
    }
    [FlightType.INBOUND]?: {
      flight: Types.ObjectId
      ticketClass: TicketClass
      ticketType: TicketType
      price: number
      reservations: {
        [FlightLegType.DEPARTURE]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
        [FlightLegType.TRANSIT]: {
          reservation: Types.ObjectId
          surcharge: number
        }[]
      }
    }
  }
  payment: {
    intentId?: string
    method?: PaymentMethod
    status?: PaymentStatus
  }

  // updatePaymentStatus(status: PaymentStatus): Promise<void>
}

const bookingSchema = new Schema<IBooking>({
  passengersQuantity: {
    [PassengerType.ADULT]: {
      type: Number,
      required: true,
    },
    [PassengerType.CHILD]: {
      type: Number,
      required: true,
    },
  },
  isRoundtrip: {
    type: Boolean,
    required: true,
    default: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  passengers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
    },
  ],
  flightsInfo: {
    [FlightType.OUTBOUND]: {
      type: {
        flight: {
          type: Schema.Types.ObjectId,
          ref: 'Flight',
          required: true,
        },
        ticketClass: {
          type: String,
          enum: TicketClass,
          required: true,
        },
        ticketType: {
          type: String,
          enum: TicketType,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        reservations: {
          [FlightLegType.DEPARTURE]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
          [FlightLegType.TRANSIT]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
        },
      },
      default: null,
    },
    [FlightType.INBOUND]: {
      type: {
        flight: {
          type: Schema.Types.ObjectId,
          ref: 'Flight',
          required: true,
        },
        ticketClass: {
          type: String,
          enum: TicketClass,
          required: true,
        },
        ticketType: {
          type: String,
          enum: TicketType,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        reservations: {
          [FlightLegType.DEPARTURE]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
          [FlightLegType.TRANSIT]: [
            {
              reservation: {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
              },
              surcharge: Number,
            },
          ],
        },
      },
      default: null,
    },
  },
  payment: {
    intentId: {
      type: String,
    },
    method: {
      type: String,
      enum: PaymentMethod,
    },
    status: {
      type: String,
      enum: PaymentStatus,
    },
  },
})

const findMiddleware: PreMiddlewareFunction = function (next) {
  this.populate('user')
    .populate('passengers')
    .populate('flightsInfo.OUTBOUND.flight')
    .populate('flightsInfo.OUTBOUND.reservations.DEPARTURE.reservation')
    .populate('flightsInfo.OUTBOUND.reservations.TRANSIT.reservation')
    .populate('flightsInfo.INBOUND.flight')
    .populate('flightsInfo.INBOUND.reservations.DEPARTURE.reservation')
    .populate('flightsInfo.INBOUND.reservations.TRANSIT.reservation')
  next()
}

bookingSchema.pre(/^find/, findMiddleware)

// bookingSchema.method('updatePaymentStatus', async function (status: PaymentStatus) {
//   this.payment.status = status

//   const reservations = [
//     ...this.flightsInfo[FlightType.OUTBOUND].reservations[FlightLegType.DEPARTURE].map(
//       (reservation) => reservation.reservation,
//     ),
//     ...this.flightsInfo[FlightType.OUTBOUND].reservations[FlightLegType.TRANSIT].map(
//       (reservation) => reservation.reservation,
//     ),
//   ]

//   await Promise.all(
//     reservations.map(async (reservation) => {
//       console.log('log', reservation, status)
//       await Reservation.findByIdAndUpdate(reservation, { status: status })
//     }),
//   )

//   // await this.save()
// })

const Booking = model<IBooking>('Booking', bookingSchema)

export default Booking
