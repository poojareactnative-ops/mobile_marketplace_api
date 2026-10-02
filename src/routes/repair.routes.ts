import { Router } from 'express';
import { RepairController } from '../controllers/repair.controller';
import { authenticate, requireRoles, requireApproved } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import {
  createRepairCustomerSchema,
  createRepairJobSchema,
  updateRepairJobSchema,
  createRepairUpdateSchema,
  bookRepairGuestSchema,
  trackRepairGuestQuerySchema,
} from '../schemas/repair.schema';
import { UserRole } from '../types/enums';
import { publicApiLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

const repairAuth = [authenticate, requireRoles(UserRole.SUPER_SELLER, UserRole.SELLER_ADMIN), requireApproved];

// Tier 3: Admin / Seller Admin Repair Jobs
router.post('/seller/admin/repair-jobs', repairAuth, validateBody(createRepairJobSchema), RepairController.createRepairJob);
router.get('/seller/admin/repair-jobs', repairAuth, RepairController.getRepairJobs);
router.get('/seller/admin/repair-jobs/:jobId', repairAuth, RepairController.getRepairJobById);
router.patch('/seller/admin/repair-jobs/:jobId', repairAuth, validateBody(updateRepairJobSchema), RepairController.updateRepairJob);
router.post('/seller/admin/repair-jobs/:jobId/updates', repairAuth, validateBody(createRepairUpdateSchema), RepairController.addRepairUpdate);

// Backwards-compatible /seller/repair-jobs endpoints
router.post('/seller/repair-customers', repairAuth, validateBody(createRepairCustomerSchema), RepairController.createCustomer);
router.get('/seller/repair-customers', repairAuth, RepairController.getCustomers);
router.post('/seller/repair-jobs', repairAuth, validateBody(createRepairJobSchema), RepairController.createRepairJob);
router.get('/seller/repair-jobs', repairAuth, RepairController.getRepairJobs);
router.get('/seller/repair-jobs/:jobId', repairAuth, RepairController.getRepairJobById);
router.patch('/seller/repair-jobs/:jobId', repairAuth, validateBody(updateRepairJobSchema), RepairController.updateRepairJob);
router.post('/seller/repair-jobs/:jobId/updates', repairAuth, validateBody(createRepairUpdateSchema), RepairController.addRepairUpdate);

// Tier 4: Client User / Guest Repair Booking & Online Ticket Tracking (Zero Registration Required)
router.post('/public/repairs/book', publicApiLimiter, validateBody(bookRepairGuestSchema), RepairController.bookRepairGuest);
router.get('/public/repairs/track', publicApiLimiter, validateQuery(trackRepairGuestQuerySchema), RepairController.trackRepairGuest);

export default router;

