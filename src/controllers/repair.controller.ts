import { Response, NextFunction } from 'express';
import { RepairService } from '../services/repair.service';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/apiError';
import { RepairStatus } from '../types/enums';

export class RepairController {
  private static getShopId(req: AuthenticatedRequest): string {
    if (!req.user?.shopId) {
      throw ApiError.forbidden('No active shop associated with user account');
    }
    return req.user.shopId;
  }

  static async createCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const data = await RepairService.createCustomer(shopId, req.body);
      return sendSuccess(res, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async getCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string;

      const result = await RepairService.getCustomers(shopId, page, limit, search);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async createRepairJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const authorUserId = req.user!.userId;
      const data = await RepairService.createRepairJob(shopId, authorUserId, req.body);
      return sendSuccess(res, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async getRepairJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as RepairStatus | undefined;
      const search = req.query.search as string;

      const result = await RepairService.getRepairJobs(shopId, page, limit, status, search);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getRepairJobById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const { jobId } = req.params;
      const data = await RepairService.getRepairJobById(shopId, jobId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateRepairJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const { jobId } = req.params;
      const authorUserId = req.user!.userId;
      const data = await RepairService.updateRepairJob(shopId, jobId, authorUserId, req.body);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async addRepairUpdate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = RepairController.getShopId(req);
      const { jobId } = req.params;
      const authorUserId = req.user!.userId;
      const data = await RepairService.addRepairUpdate(shopId, jobId, authorUserId, req.body);
      return sendSuccess(res, data, 201);
    } catch (error) {
      return next(error);
    }
  }
}
