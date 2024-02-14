"use strict";
// require('module-alias/register')
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drop = exports.init = exports.connect = void 0;
const aircraft_model_1 = __importDefault(require("@/models/aircraft/aircraft.model"));
const aircraftModel_model_1 = __importDefault(require("@/models/aircraft/aircraftModel.model"));
const airport_model_1 = __importDefault(require("@/models/flight/airport.model"));
const flight_model_1 = __importDefault(require("@/models/flight/flight.model"));
const flightRoute_model_1 = __importDefault(require("@/models/flight/flightRoute.model"));
const user_model_1 = __importDefault(require("@/models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', true);
if (!process.env.MONGODB_STRING || !process.env.MONGODB_DATABASE) {
    throw new Error('Some DB configs have not set yet');
}
let DB_string = process.env.MONGODB_STRING.replace('<database>', process.env.MONGODB_DATABASE);
if (process.env.MONGODB_TYPE != 'local') {
    if (!process.env.MONGODB_STRING || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('Some DB configs have not set yet');
    }
    DB_string = DB_string.replace('<username>', process.env.MONGODB_USERNAME).replace('<password>', process.env.MONGODB_PASSWORD);
}
const connect = () => mongoose_1.default.connect(DB_string, {}).then(() => console.log('DB connect successful'));
exports.connect = connect;
const init = () => Promise.all([
// require('@/models/Author.model').init(),
]).then(() => console.log('DB init successful'));
exports.init = init;
const drop = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        user_model_1.default.deleteMany({}),
        aircraftModel_model_1.default.deleteMany({}),
        aircraft_model_1.default.deleteMany({}),
        airport_model_1.default.deleteMany({}),
        flightRoute_model_1.default.deleteMany({}),
        flight_model_1.default.deleteMany({}),
    ]).then(() => console.log('DB drop successful'));
    // await mongoose.connection.db.dropDatabase()
});
exports.drop = drop;
