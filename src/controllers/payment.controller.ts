import config from '@/config'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.secretKey)

export const intents = async (req: Request, res: Response, next: NextFunction) => {
  const amount = 10000

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: { uid: 'testuid123' },
  })

  return res.json({
    status: 'success',
    data: { paymentIntent },
  })
}
