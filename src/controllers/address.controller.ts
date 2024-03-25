import config from '@/config'
import Country from '@/models/address/country.model'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

export default {
  getCountries: async (req: Request, res: Response, next: NextFunction) => {
    const countries = await Country.find({})

    return res.json({
      status: 'success',
      data: countries,
    })
  },
}
