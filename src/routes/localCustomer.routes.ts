import { Router } from 'express';
import { LocalCustomerController } from '../controllers/localCustomer.controller';
import { authenticate, requireRoles, requireApproved } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { createLocalCustomerSchema, localCustomerQuerySchema } from '../schemas/localCustomer.schema';
import { UserRole } from '../types/enums';

const router = Router();

const shopStaffAuth = [authenticate, requireRoles(UserRole.SUPER_SELLER, UserRole.SELLER_ADMIN), requireApproved];

router.get('/seller/admin/customers', shopStaffAuth, validateQuery(localCustomerQuerySchema), LocalCustomerController.listCustomers);
router.post('/seller/admin/customers', shopStaffAuth, validateBody(createLocalCustomerSchema), LocalCustomerController.createCustomer);

export default router;
