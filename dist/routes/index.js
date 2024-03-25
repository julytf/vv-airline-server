"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_routes_1 = __importDefault(require("./payment.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const searchWizard_routes_1 = __importDefault(require("./searchWizard.routes"));
const booking_routes_1 = __importDefault(require("./booking.routes"));
const airports_routes_1 = __importDefault(require("./airports.routes"));
const flightRoutes_routes_1 = __importDefault(require("./flightRoutes.routes"));
const flightLegs_routes_1 = __importDefault(require("./flightLegs.routes"));
const address_routes_1 = __importDefault(require("./address.routes"));
const articles_routes_1 = __importDefault(require("./articles.routes"));
const files_routes_1 = __importDefault(require("./files.routes"));
const flights_routes_1 = __importDefault(require("./flights.routes"));
const aircrafts_routes_1 = __importDefault(require("./aircrafts.routes"));
const aircraftModels_routes_1 = __importDefault(require("./aircraftModels.routes"));
const router = (0, express_1.Router)();
router.route('/api').get((req, res, next) => {
    return res.json({
        message: 'Welcome to Life Diary API!',
        status: 'success',
    });
});
router.use('/api/auth', auth_routes_1.default);
router.use('/api/files', files_routes_1.default);
router.use('/api/search-wizard', searchWizard_routes_1.default);
router.use('/api/payment', payment_routes_1.default);
router.use('/api/aircrafts', aircrafts_routes_1.default);
router.use('/api/aircraft-models', aircraftModels_routes_1.default);
router.use('/api/address', address_routes_1.default);
router.use('/api/articles', articles_routes_1.default);
router.use('/api/booking', booking_routes_1.default);
router.use('/api/airports', airports_routes_1.default);
router.use('/api/flight-legs', flightLegs_routes_1.default);
router.use('/api/flight-routes', flightRoutes_routes_1.default);
router.use('/api/flights', flights_routes_1.default);
router.use('/api/users', users_routes_1.default);
exports.default = router;
