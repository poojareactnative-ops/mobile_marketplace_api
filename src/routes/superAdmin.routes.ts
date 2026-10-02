import { Router } from 'express';
import { SuperAdminController } from '../controllers/superAdmin.controller';
import { authenticate, requireRoles } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import {
  listRequestsQuerySchema,
  approveRequestSchema,
  rejectRequestSchema,
  createPlanSchema,
} from '../schemas/superAdmin.schema';
import { UserRole } from '../types/enums';

const router = Router();

const superAdminAuth = [authenticate, requireRoles(UserRole.SUPER_ADMIN, UserRole.SYSTEM_USER)];

// Super Seller Onboarding Request Approvals & Governance
router.get('/super-admin/requests', superAdminAuth, validateQuery(listRequestsQuerySchema), SuperAdminController.listRequests);
router.patch('/super-admin/requests/:requestId/approve', superAdminAuth, validateBody(approveRequestSchema), SuperAdminController.approveRequest);
router.patch('/super-admin/requests/:requestId/reject', superAdminAuth, validateBody(rejectRequestSchema), SuperAdminController.rejectRequest);

// Future Monetization & Subscription Plans Management
router.post('/super-admin/plans', superAdminAuth, validateBody(createPlanSchema), SuperAdminController.createPlan);
router.get('/super-admin/plans', superAdminAuth, SuperAdminController.listPlans);

// Platform Traffic & Visitor Oversight
router.get('/super-admin/analytics', superAdminAuth, SuperAdminController.getAnalytics);

export default router;
