import { z } from 'zod';
import { UserStatus } from '../types/enums';

export const createSellerAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

export const updateSellerAdminStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.SUSPENDED]),
});

export type CreateSellerAdminInput = z.infer<typeof createSellerAdminSchema>;
export type UpdateSellerAdminStatusInput = z.infer<typeof updateSellerAdminStatusSchema>;
