import { Response, NextFunction } from 'express';
import { SystemService } from '../services/system.service';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApplicationStatus } from '../types/enums';

export class SystemController {
  static async getVisitorAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || '30d';
      const data = await SystemService.getVisitorAnalytics(period);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getSellerApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as ApplicationStatus | undefined;
      const data = await SystemService.getSellerApplications(status);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getSellerApplicationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await SystemService.getSellerApplicationById(id);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async approveSellerApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const systemUserId = req.user!.userId;
      const data = await SystemService.approveSellerApplication(id, systemUserId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async rejectSellerApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const systemUserId = req.user!.userId;
      const { rejectionReason } = req.body;
      const data = await SystemService.rejectSellerApplication(id, systemUserId, rejectionReason);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllShops(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string;

      const result = await SystemService.getAllShops(page, limit, search);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateShopStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isActive, isVerified } = req.body;
      const data = await SystemService.updateShopStatus(id, isActive, isVerified);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getLandingPageSections(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await SystemService.getLandingPageSections();
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateLandingPageSection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { key } = req.body;
      const data = await SystemService.updateLandingPageSection(key, req.body);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }
}
