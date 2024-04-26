import { Router } from 'express'
import AddressController from '@/controllers/address.controller'

const router = Router()

router.route('/countries').get(AddressController.getCountries)
router.route('/provinces').get(AddressController.getProvinces)
router.route('/districts').get(AddressController.getDistricts)
router.route('/wards').get(AddressController.getWards)

export default router
