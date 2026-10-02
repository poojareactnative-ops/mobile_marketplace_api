import { z } from 'zod';

export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().optional(),
  position: z.number().int().nonnegative().optional().default(0),
});

export const createProductSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  name: z.string().min(2, 'Product name is required'),
  brand: z.string().optional(),
  sku: z.string().optional(),
  modelCompatibility: z.string().optional(),
  conditionState: z.string().optional().default('New'),
  warranty: z.string().optional(),
  pricePaise: z.number().int().nonnegative('Price in paise must be non-negative'),
  compareAtPricePaise: z.number().int().nonnegative().optional(),
  discountPercent: z.number().int().nonnegative().optional().default(0),
  stock: z.number().int().nonnegative('Stock must be non-negative').default(0),
  status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED']).default('ACTIVE'),
  features: z.string().optional(),
  tags: z.string().optional(),
  description: z.string().optional(),
  images: z.array(productImageSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest'),
});

export const nearestProductsQuerySchema = z.object({
  lat: z.coerce.number({ required_error: 'Client GPS latitude is required' }),
  lng: z.coerce.number({ required_error: 'Client GPS longitude is required' }),
  radiusMeters: z.coerce.number().min(100).max(50000).default(2500),
  categoryId: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(50),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type NearestProductsQueryInput = z.infer<typeof nearestProductsQuerySchema>;
