"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minNotNull = void 0;
const minNotNull = (...arr) => {
    const nums = arr.filter((item) => typeof item === 'number');
    return Math.min(...nums);
};
exports.minNotNull = minNotNull;
