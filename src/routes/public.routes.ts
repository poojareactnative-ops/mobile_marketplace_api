import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { whatsappEnquirySchema, trackVisitorSchema } from '../schemas/enquiry.schema';
import { nearbyShopsQuerySchema } from '../schemas/shop.schema';
import { nearestProductsQuerySchema } from '../schemas/product.schema';
import { publicApiLimiter, enquiryLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Tier 4: Zero-Registration Client Discovery (Nearest Haversine Proximity)
router.get('/public/products/nearest', publicApiLimiter, validateQuery(nearestProductsQuerySchema), PublicController.getNearestProducts);
router.get('/shops/nearby', publicApiLimiter, validateQuery(nearbyShopsQuerySchema), PublicController.getNearbyShops);

// Direct WhatsApp Zero-Auth Lead Generation
router.post('/enquiries', enquiryLimiter, validateBody(whatsappEnquirySchema), PublicController.createEnquiry);
router.post('/enquiries/whatsapp', enquiryLimiter, validateBody(whatsappEnquirySchema), PublicController.createWhatsAppEnquiry);

// Public Catalog, Storefront & Landing Page
router.get('/public/landing-page', publicApiLimiter, PublicController.getLandingPage);
router.get('/products/featured', publicApiLimiter, PublicController.getFeaturedProducts);
router.get('/categories', publicApiLimiter, PublicController.getCategories);
router.get('/shops/:shopId', publicApiLimiter, PublicController.getShopById);
router.get('/shops/:shopId/products', publicApiLimiter, PublicController.getShopProducts);
router.post('/analytics/track-visitor', publicApiLimiter, validateBody(trackVisitorSchema), PublicController.trackVisitor);

export default router;

