import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/uploads/presign', authenticate, UploadController.presignUploadUrl);

export default router;
