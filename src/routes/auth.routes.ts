import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import {
  registerSellerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register-seller', validateBody(registerSellerSchema), AuthController.registerSeller);
router.post('/register-super-seller', validateBody(registerSellerSchema), AuthController.registerSeller);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refresh);
router.post('/forgot-password', validateBody(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), AuthController.resetPassword);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;

