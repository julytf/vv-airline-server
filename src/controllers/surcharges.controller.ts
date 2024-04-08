import config from '@/config'
import Country from '@/models/address/country.model'
import Surcharge from '@/models/flight/surcharge.model'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

export default {
  getSurcharges: async (req: Request, res: Response, next: NextFunction) => {
    const surcharges = await Surcharge.find({})

    return res.json({
      status: 'success',
      data: surcharges,
    })
  },
}
