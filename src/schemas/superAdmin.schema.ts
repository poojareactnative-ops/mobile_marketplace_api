import { z } from 'zod';
import { ApplicationStatus, BillingStatus, PlanTier } from '../types/enums';

export const listRequestsQuerySchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  billingStatus: z.nativeEnum(BillingStatus).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20)),
});

export const approveRequestSchema = z.object({
  grantVerificationBadge: z.boolean().optional().default(true),
  planTier: z.nativeEnum(PlanTier).optional().default(PlanTier.STANDARD_FREE),
  billingStatus: z.nativeEnum(BillingStatus).optional().default(BillingStatus.FREE_TIER),
  adminNotes: z.string().optional(),
});

export const rejectRequestSchema = z.object({
  rejectionReason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});

export const createPlanSchema = z.object({
  code: z.string().min(2, 'Code is required, e.g. PRO_ANNUAL'),
  name: z.string().min(2, 'Name is required'),
  pricePaise: z.number().int().min(0, 'Price in paise must be non-negative'),
  durationDays: z.number().int().min(1).default(30),
  maxProducts: z.number().int().min(1).default(100),
  maxAdmins: z.number().int().min(1).default(3),
  featuresJson: z.record(z.any()).optional(),
  isActive: z.boolean().optional().default(true),
});

export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;
export type RejectRequestInput = z.infer<typeof rejectRequestSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
