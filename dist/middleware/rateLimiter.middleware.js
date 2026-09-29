"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryLimiter = exports.publicApiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.publicApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this IP, please try again later.',
        },
    },
});
exports.enquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // max 20 whatsapp enquiries per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many enquiries sent. Please wait a moment before trying again.',
        },
    },
});
