"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearbyShopsQuerySchema = exports.updateShopSchema = void 0;
const zod_1 = require("zod");
exports.updateShopSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    type: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10).optional(),
    whatsappNumber: zod_1.z.string().min(10).optional(),
    address: zod_1.z.string().min(5).optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    openingHours: zod_1.z.string().optional(),
});
exports.nearbyShopsQuerySchema = zod_1.z.object({
    lat: zod_1.z.coerce.number({ invalid_type_error: 'lat is required and must be a number' }),
    lng: zod_1.z.coerce.number({ invalid_type_error: 'lng is required and must be a number' }),
    radiusMeters: zod_1.z.coerce.number().optional().default(2500),
    search: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
