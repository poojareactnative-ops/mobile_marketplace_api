import { Router } from 'express';
import { SuperSellerController } from '../controllers/superSeller.controller';
import { authenticate, requireRoles, requireApproved } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createSellerAdminSchema, updateSellerAdminStatusSchema } from '../schemas/superSeller.schema';
import { UserRole } from '../types/enums';

const router = Router();

const superSellerAuth = [authenticate, requireRoles(UserRole.SUPER_SELLER), requireApproved];

router.post('/super-seller/admins', superSellerAuth, validateBody(createSellerAdminSchema), SuperSellerController.createAdmin);
router.get('/super-seller/admins', superSellerAuth, SuperSellerController.listAdmins);
router.patch('/super-seller/admins/:adminId', superSellerAuth, validateBody(updateSellerAdminStatusSchema), SuperSellerController.updateAdminStatus);
router.delete('/super-seller/admins/:adminId', superSellerAuth, SuperSellerController.deleteAdmin);

export default router;
