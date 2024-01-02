"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("@/routes"));
const app = (0, express_1.default)();
// app middlewares
// app.use(morgan('dev')) 
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// app.use(express.json({ limit: '10kb' }))
// app.use(express.urlencoded({ extended: true, limit: '10kb' }))
// app.use(upload.array());
app.use(express_1.default.static(`${__dirname}/../public`));
// test
// app.use('/test', function (req, res, next) {
//   throw new Error('test error') 
//   res.send('test')
// })
// router
app.use(routes_1.default);
// app error handler
// app.use(errorHandler)
exports.default = app;
