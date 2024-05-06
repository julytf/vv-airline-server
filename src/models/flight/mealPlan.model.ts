import { model, Schema } from 'mongoose'

export interface IMealPlan {
  title: string
  name: string
  value: number | null
}

const mealPlanSchema = new Schema<IMealPlan>({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
  },
})

const MealPlan = model<IMealPlan>('MealPlan', mealPlanSchema)

export default MealPlan
