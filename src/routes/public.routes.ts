import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { whatsappEnquirySchema, trackVisitorSchema } from '../schemas/enquiry.schema';
import { nearbyShopsQuerySchema } from '../schemas/shop.schema';
import { publicApiLimiter, enquiryLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.get('/public/landing-page', publicApiLimiter, PublicController.getLandingPage);
router.get('/shops/nearby', publicApiLimiter, validateQuery(nearbyShopsQuerySchema), PublicController.getNearbyShops);
router.get('/products/featured', publicApiLimiter, PublicController.getFeaturedProducts);
router.get('/categories', publicApiLimiter, PublicController.getCategories);
router.get('/shops/:shopId', publicApiLimiter, PublicController.getShopById);
router.get('/shops/:shopId/products', publicApiLimiter, PublicController.getShopProducts);
router.post('/enquiries/whatsapp', enquiryLimiter, validateBody(whatsappEnquirySchema), PublicController.createWhatsAppEnquiry);
router.post('/analytics/track-visitor', publicApiLimiter, validateBody(trackVisitorSchema), PublicController.trackVisitor);

export default router;
