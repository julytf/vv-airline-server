import { updateOne } from '../controllers/factory/index'
import { Router } from 'express'
import MealPlansController from '@/controllers/mealPlans.controller'

const router = Router()

router.route('/').get(MealPlansController.getMealPlans)
router.route('/:id').patch(MealPlansController.updateOne)

export default router
