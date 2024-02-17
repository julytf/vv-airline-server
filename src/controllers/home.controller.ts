import config from '@/config'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.secretKey)

export default {
  index: async (req: Request, res: Response, next: NextFunction) => {
    const query = User.where({ _id: '0' })

    return res.json({
      status: 'success',
    })
  },
}
