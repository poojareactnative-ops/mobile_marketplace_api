import { Response, NextFunction } from 'express';
import { SuperSellerService } from '../services/superSeller.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/apiError';

export class SuperSellerController {
  private static getShopId(req: AuthenticatedRequest): string {
    if (!req.user?.shopId) {
      throw ApiError.forbidden('No active shop associated with your Super Seller account');
    }
    return req.user.shopId;
  }

  static async createAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SuperSellerController.getShopId(req);
      const superSellerUserId = req.user!.userId;
      const data = await SuperSellerService.createAdmin(shopId, superSellerUserId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Admin user created successfully for your shop.',
        data,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmins(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SuperSellerController.getShopId(req);
      const superSellerUserId = req.user!.userId;
      const data = await SuperSellerService.listAdmins(shopId, superSellerUserId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateAdminStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SuperSellerController.getShopId(req);
      const superSellerUserId = req.user!.userId;
      const { adminId } = req.params;
      const data = await SuperSellerService.updateAdminStatus(shopId, superSellerUserId, adminId, req.body);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = SuperSellerController.getShopId(req);
      const superSellerUserId = req.user!.userId;
      const { adminId } = req.params;
      const data = await SuperSellerService.deleteAdmin(shopId, superSellerUserId, adminId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }
}
