"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorAnalyticsQuerySchema = exports.landingSectionSchema = exports.updateShopStatusSchema = exports.rejectApplicationSchema = void 0;
const zod_1 = require("zod");
exports.rejectApplicationSchema = zod_1.z.object({
    rejectionReason: zod_1.z.string().min(3, 'Rejection reason is required'),
});
exports.updateShopStatusSchema = zod_1.z.object({
    isActive: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
});
exports.landingSectionSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    subtitle: zod_1.z.string().optional(),
    body: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    ctaLabel: zod_1.z.string().optional(),
    ctaUrl: zod_1.z.string().optional(),
    isPublished: zod_1.z.boolean().optional().default(true),
    sortOrder: zod_1.z.number().int().optional().default(0),
});
exports.visitorAnalyticsQuerySchema = zod_1.z.object({
    period: zod_1.z.enum(['24h', '7d', '30d', '90d', 'all']).optional().default('30d'),
});
