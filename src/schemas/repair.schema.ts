import { z } from 'zod';
import { RepairStatus } from '../types/enums';

export const createRepairCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const createRepairJobSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Customer phone is required'),
  repairCustomerId: z.string().uuid().optional(),
  deviceId: z.string().min(1, 'Device identifier is required'),
  problemDescription: z.string().min(3, 'Problem description is required'),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
  isSellable: z.boolean().optional().default(false),
});

export const updateRepairJobSchema = z.object({
  status: z.nativeEnum(RepairStatus).optional(),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
  isSellable: z.boolean().optional(),
  assignedToUserId: z.string().uuid().optional(),
});

export const createRepairUpdateSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  note: z.string().min(1, 'Note is required'),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
});

export type CreateRepairCustomerInput = z.infer<typeof createRepairCustomerSchema>;
export type CreateRepairJobInput = z.infer<typeof createRepairJobSchema>;
export type UpdateRepairJobInput = z.infer<typeof updateRepairJobSchema>;
export type CreateRepairUpdateInput = z.infer<typeof createRepairUpdateSchema>;
