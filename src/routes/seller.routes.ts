import { Router } from 'express';
import { SellerController } from '../controllers/seller.controller';
import { authenticate, requireRoles, requireApproved } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas/product.schema';
import { updateShopSchema } from '../schemas/shop.schema';
import { UserRole } from '../types/enums';

const router = Router();

const sellerAuth = [authenticate, requireRoles(UserRole.SUPER_SELLER, UserRole.SELLER_ADMIN), requireApproved];

router.get('/seller/dashboard', sellerAuth, SellerController.getDashboardSummary);

router.get('/seller/products', sellerAuth, validateQuery(productQuerySchema), SellerController.getProducts);
router.post('/seller/products', sellerAuth, validateBody(createProductSchema), SellerController.createProduct);
router.get('/seller/products/:productId', sellerAuth, SellerController.getProductById);
router.patch('/seller/products/:productId', sellerAuth, validateBody(updateProductSchema), SellerController.updateProduct);
router.delete('/seller/products/:productId', sellerAuth, SellerController.deleteProduct);

router.get('/seller/enquiries', sellerAuth, SellerController.getEnquiries);

router.get('/seller/shop', sellerAuth, SellerController.getShopProfile);
router.patch('/seller/shop', sellerAuth, validateBody(updateShopSchema), SellerController.updateShopProfile);

export default router;
