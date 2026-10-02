import { z } from 'zod';
import { RepairStatus } from '../types/enums';

export const createRepairCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const createRepairJobSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Customer phone is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  brand: z.string().optional(),
  model: z.string().optional(),
  deviceId: z.string().optional(),
  problemDescription: z.string().min(3, 'Problem description is required'),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
  isSellable: z.boolean().optional().default(false),
  repairCustomerId: z.string().optional(),
});

export const updateRepairJobSchema = z.object({
  status: z.nativeEnum(RepairStatus).optional(),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
  finalCostPaise: z.number().int().nonnegative().optional(),
  note: z.string().optional(),
  isSellable: z.boolean().optional(),
  assignedToUserId: z.string().optional(),
});

export const createRepairUpdateSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  note: z.string().min(1, 'Note is required'),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
});

export const bookRepairGuestSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Customer phone is required'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  problemDescription: z.string().min(3, 'Problem description is required'),
  preferredShopId: z.string().optional(),
});

export const trackRepairGuestQuerySchema = z.object({
  ticketId: z.string().optional(),
  phone: z.string().optional(),
});

export type CreateRepairCustomerInput = z.infer<typeof createRepairCustomerSchema>;
export type CreateRepairJobInput = z.infer<typeof createRepairJobSchema>;
export type UpdateRepairJobInput = z.infer<typeof updateRepairJobSchema>;
export type CreateRepairUpdateInput = z.infer<typeof createRepairUpdateSchema>;
export type BookRepairGuestInput = z.infer<typeof bookRepairGuestSchema>;
export type TrackRepairGuestQueryInput = z.infer<typeof trackRepairGuestQuerySchema>;
