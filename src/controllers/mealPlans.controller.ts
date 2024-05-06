import config from '@/config'
import Country from '@/models/address/country.model'
import MealPlan from '@/models/flight/mealPlan.model'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import * as factory from './factory'

export default {
  getMealPlans: async (req: Request, res: Response, next: NextFunction) => {
    const mealPlans = await MealPlan.find({})

    return res.json({
      status: 'success',
      data: mealPlans,
    })
  },
  updateOne: factory.updateOne(MealPlan),
}
