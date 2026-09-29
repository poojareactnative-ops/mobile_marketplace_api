"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = exports.productImageSchema = void 0;
const zod_1 = require("zod");
exports.productImageSchema = zod_1.z.object({
    url: zod_1.z.string().url('Invalid image URL'),
    altText: zod_1.z.string().optional(),
    position: zod_1.z.number().int().nonnegative().optional().default(0),
});
exports.createProductSchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid('Invalid categoryId format'),
    name: zod_1.z.string().min(2, 'Product name is required'),
    brand: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    pricePaise: zod_1.z.number().int().nonnegative('Price in paise must be non-negative'),
    compareAtPricePaise: zod_1.z.number().int().nonnegative().optional(),
    stock: zod_1.z.number().int().nonnegative('Stock must be non-negative').default(0),
    status: zod_1.z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']).default('ACTIVE'),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(exports.productImageSchema).optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
    search: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    minPrice: zod_1.z.coerce.number().int().nonnegative().optional(),
    maxPrice: zod_1.z.coerce.number().int().nonnegative().optional(),
    sort: zod_1.z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest'),
});
