import { Router } from 'express'
import AddressController from '@/controllers/address.controller'

const router = Router()

router.route('/get-countries').get(AddressController.getCountries)

export default router
