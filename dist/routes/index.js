"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.route('/').get((req, res, next) => {
    return res.json({
        message: 'Welcome to Life Diary API!',
        status: 'success',
    });
});
exports.default = router;
