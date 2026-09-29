"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.hashIpAddress = hashIpAddress;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function hashIpAddress(ip) {
    const salt = 'emp_api_ip_privacy_salt_2026';
    return crypto_1.default.createHash('sha256').update(ip + salt).digest('hex');
}
