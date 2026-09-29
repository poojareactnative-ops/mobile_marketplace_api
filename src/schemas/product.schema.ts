import { z } from 'zod';

export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().optional(),
  position: z.number().int().nonnegative().optional().default(0),
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid('Invalid categoryId format'),
  name: z.string().min(2, 'Product name is required'),
  brand: z.string().optional(),
  sku: z.string().optional(),
  pricePaise: z.number().int().nonnegative('Price in paise must be non-negative'),
  compareAtPricePaise: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative('Stock must be non-negative').default(0),
  status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']).default('ACTIVE'),
  description: z.string().optional(),
  images: z.array(productImageSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
