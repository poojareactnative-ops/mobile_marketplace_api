import { z } from 'zod';

export const rejectApplicationSchema = z.object({
  rejectionReason: z.string().min(3, 'Rejection reason is required'),
});

export const updateShopStatusSchema = z.object({
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export const landingSectionSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  imageUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const visitorAnalyticsQuerySchema = z.object({
  period: z.enum(['24h', '7d', '30d', '90d', 'all']).optional().default('30d'),
});

export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>;
export type UpdateShopStatusInput = z.infer<typeof updateShopStatusSchema>;
