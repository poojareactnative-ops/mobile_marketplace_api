import { Router } from 'express';
import authRoutes from './auth.routes';
import publicRoutes from './public.routes';
import systemRoutes from './system.routes';
import sellerRoutes from './seller.routes';
import repairRoutes from './repair.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', publicRoutes);
router.use('/', systemRoutes);
router.use('/', sellerRoutes);
router.use('/', repairRoutes);
router.use('/', uploadRoutes);

export default router;
