import { Response, NextFunction } from 'express';
import { LocalCustomerService } from '../services/localCustomer.service';
import { sendPaginated, sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/apiError';

export class LocalCustomerController {
  private static getShopId(req: AuthenticatedRequest): string {
    if (!req.user?.shopId) {
      throw ApiError.forbidden('No active shop associated with your admin account');
    }
    return req.user.shopId;
  }

  static async listCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = LocalCustomerController.getShopId(req);
      const result = await LocalCustomerService.listCustomers(shopId, req.query as any);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async createCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = LocalCustomerController.getShopId(req);
      const adminUserId = req.user!.userId;
      const data = await LocalCustomerService.createCustomer(shopId, adminUserId, req.body);
      return sendSuccess(res, data, 201);
    } catch (error) {
      return next(error);
    }
  }
}
