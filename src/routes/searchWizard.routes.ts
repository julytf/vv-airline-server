import { Router } from 'express'
import authMiddleware from '@/middlewares/auth.middleware'
import searchWizardController from '@/controllers/searchWizard.controller'

const router = Router()

// router.route('/get-flight-routes').get(searchWizardController.getFlightRoutes)
router.route('/get-airport').get(searchWizardController.getAirport)
router.route('/get-airports').get(searchWizardController.getAirports)
router.route('/get-flights').get(searchWizardController.getFlights)

export default router
