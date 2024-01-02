"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drop = exports.init = exports.connect = void 0;
// require('module-alias/register')
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
const drop = () => Promise.all([
// require('@/models/Author.model').deleteMany({}),
]).then(() => console.log('DB drop successful'));
exports.drop = drop;
