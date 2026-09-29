"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSellerSchema = void 0;
const zod_1 = require("zod");
exports.registerSellerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().min(10, 'Phone must be at least 10 digits'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    shopName: zod_1.z.string().min(2, 'Shop name must be at least 2 characters'),
    shopType: zod_1.z.string().min(2, 'Shop type is required'),
    address: zod_1.z.string().min(5, 'Address must be at least 5 characters'),
    latitude: zod_1.z.number().optional().default(12.9716),
    longitude: zod_1.z.number().optional().default(77.5946),
    whatsappNumber: zod_1.z.string().optional(),
    businessDocUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    openingHours: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
