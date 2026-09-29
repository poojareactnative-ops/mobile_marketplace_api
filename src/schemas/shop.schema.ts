import { z } from 'zod';

export const updateShopSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.string().min(2).optional(),
  description: z.string().optional(),
  phone: z.string().min(10).optional(),
  whatsappNumber: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openingHours: z.string().optional(),
});

export const nearbyShopsQuerySchema = z.object({
  lat: z.coerce.number({ invalid_type_error: 'lat is required and must be a number' }),
  lng: z.coerce.number({ invalid_type_error: 'lng is required and must be a number' }),
  radiusMeters: z.coerce.number().optional().default(2500),
  search: z.string().optional(),
  type: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type UpdateShopInput = z.infer<typeof updateShopSchema>;
export type NearbyShopsQueryInput = z.infer<typeof nearbyShopsQuerySchema>;
