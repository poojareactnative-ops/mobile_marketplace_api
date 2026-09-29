import { Router } from 'express';
import { SystemController } from '../controllers/system.controller';
import { authenticate, requireRoles } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { rejectApplicationSchema, updateShopStatusSchema } from '../schemas/system.schema';
import { UserRole } from '../types/enums';

const router = Router();

const systemAuth = [authenticate, requireRoles(UserRole.SYSTEM_USER)];

router.get('/system/analytics/visitors', systemAuth, SystemController.getVisitorAnalytics);
router.get('/system/seller-applications', systemAuth, SystemController.getSellerApplications);
router.get('/system/seller-applications/:id', systemAuth, SystemController.getSellerApplicationById);
router.patch('/system/seller-applications/:id/approve', systemAuth, SystemController.approveSellerApplication);
router.patch('/system/seller-applications/:id/reject', systemAuth, validateBody(rejectApplicationSchema), SystemController.rejectSellerApplication);

router.get('/system/shops', systemAuth, SystemController.getAllShops);
router.patch('/system/shops/:id', systemAuth, validateBody(updateShopStatusSchema), SystemController.updateShopStatus);

router.get('/system/landing-page', systemAuth, SystemController.getLandingPageSections);
router.patch('/system/landing-page', systemAuth, SystemController.updateLandingPageSection);

export default router;
