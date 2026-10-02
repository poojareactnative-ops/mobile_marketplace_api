import { z } from 'zod';

export const registerSellerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  shopType: z.string().min(2, 'Shop type is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  latitude: z.number().optional().default(12.9716),
  longitude: z.number().optional().default(77.5946),
  whatsappNumber: z.string().optional(),
  businessDocUrl: z.string().url().optional().or(z.literal('')),
  openingHours: z.string().optional(),
  planType: z.string().optional().default('STANDARD_FREE'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterSellerInput = z.infer<typeof registerSellerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
