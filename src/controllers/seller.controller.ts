import { Response, NextFunction } from 'express';
import { SellerService } from '../services/seller.service';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/apiError';

export class SellerController {
  private static getShopId(req: AuthenticatedRequest): string {
    if (!req.user?.shopId) {
      throw ApiError.forbidden('No active shop associated with user account');
    }
    return req.user.shopId;
  }

  static async getDashboardSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const period = (req.query.period as string) || '30d';
      const data = await SellerService.getDashboardSummary(shopId, period);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const query = req.query as any;
      const result = await SellerService.getProducts(shopId, query);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const data = await SellerService.createProduct(shopId, req.body);
      return sendSuccess(res, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async getProductById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const { productId } = req.params;
      const data = await SellerService.getProductById(shopId, productId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const { productId } = req.params;
      const data = await SellerService.updateProduct(shopId, productId, req.body);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const { productId } = req.params;
      const data = await SellerService.deleteProduct(shopId, productId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getEnquiries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await SellerService.getEnquiries(shopId, page, limit);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getShopProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const data = await SellerService.getShopProfile(shopId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateShopProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SellerController.getShopId(req);
      const data = await SellerService.updateShopProfile(shopId, req.body);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }
}
