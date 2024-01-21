"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_routes_1 = __importDefault(require("./payment.routes"));
const router = (0, express_1.Router)();
router.route('/api').get((req, res, next) => {
    return res.json({
        message: 'Welcome to Life Diary API!',
        status: 'success',
    });
});
router.use('/api/payment', payment_routes_1.default);
exports.default = router;
