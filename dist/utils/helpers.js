"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePNR = exports.minNotNull = void 0;
const minNotNull = (...arr) => {
    const nums = arr.filter((item) => typeof item === 'number');
    return Math.min(...nums);
};
exports.minNotNull = minNotNull;
function generatePNR() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
        pnr += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return pnr;
}
exports.generatePNR = generatePNR;
