import { Router } from 'express'

const router = Router()

router.route('/').get((req, res, next) => {
  return res.json({
    message: 'Welcome to Life Diary API!',
    status: 'success',
  })
})

export default router
