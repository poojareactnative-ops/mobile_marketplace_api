import { Router } from 'express';
import { RepairController } from '../controllers/repair.controller';
import { authenticate, requireRoles, requireApproved } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  createRepairCustomerSchema,
  createRepairJobSchema,
  updateRepairJobSchema,
  createRepairUpdateSchema,
} from '../schemas/repair.schema';
import { UserRole } from '../types/enums';

const router = Router();

const repairAuth = [authenticate, requireRoles(UserRole.SUPER_SELLER, UserRole.SELLER_ADMIN), requireApproved];

router.post('/seller/repair-customers', repairAuth, validateBody(createRepairCustomerSchema), RepairController.createCustomer);
router.get('/seller/repair-customers', repairAuth, RepairController.getCustomers);

router.post('/seller/repair-jobs', repairAuth, validateBody(createRepairJobSchema), RepairController.createRepairJob);
router.get('/seller/repair-jobs', repairAuth, RepairController.getRepairJobs);
router.get('/seller/repair-jobs/:jobId', repairAuth, RepairController.getRepairJobById);
router.patch('/seller/repair-jobs/:jobId', repairAuth, validateBody(updateRepairJobSchema), RepairController.updateRepairJob);
router.post('/seller/repair-jobs/:jobId/updates', repairAuth, validateBody(createRepairUpdateSchema), RepairController.addRepairUpdate);

export default router;
