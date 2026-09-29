"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackVisitorSchema = exports.whatsappEnquirySchema = void 0;
const zod_1 = require("zod");
exports.whatsappEnquirySchema = zod_1.z.object({
    shopId: zod_1.z.string().uuid('Invalid shopId format'),
    productId: zod_1.z.string().uuid('Invalid productId format').optional(),
    customerName: zod_1.z.string().min(2, 'Customer name must be at least 2 characters'),
    customerPhone: zod_1.z.string().min(10, 'Customer phone must be at least 10 digits'),
    message: zod_1.z.string().min(1, 'Message is required'),
});
exports.trackVisitorSchema = zod_1.z.object({
    visitorId: zod_1.z.string().min(1, 'visitorId is required'),
    pageUrl: zod_1.z.string().min(1, 'pageUrl is required'),
    actionType: zod_1.z.enum(['PAGE_VIEW', 'NEARBY_SEARCH', 'WHATSAPP_ENQUIRY_CLICK']),
    shopId: zod_1.z.string().uuid().optional(),
    userAgent: zod_1.z.string().optional(),
});
