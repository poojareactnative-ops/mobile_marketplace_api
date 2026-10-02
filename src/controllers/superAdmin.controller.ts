import { Response, NextFunction } from 'express';
import { SuperAdminService } from '../services/superAdmin.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SuperAdminController {
  static async listRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SuperAdminService.listRequests(req.query as any);
      return res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async approveRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const adminId = req.user!.userId;
      const result = await SuperAdminService.approveRequest(requestId, adminId, req.body);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          requestId: result.requestId,
          status: result.status,
          shopId: result.shopId,
          isVerified: result.isVerified,
          isActive: result.isActive,
          planTier: result.planTier,
          billingStatus: result.billingStatus,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async rejectRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const adminId = req.user!.userId;
      const result = await SuperAdminService.rejectRequest(requestId, adminId, req.body);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          requestId: result.requestId,
          status: result.status,
          rejectionReason: result.rejectionReason,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createPlan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const plan = await SuperAdminService.createPlan(req.body);
      return sendSuccess(res, plan, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async listPlans(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const plans = await SuperAdminService.listPlans();
      return sendSuccess(res, plans, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || '30d';
      const analytics = await SuperAdminService.getAnalytics(period);
      return sendSuccess(res, analytics, 200);
    } catch (error) {
      return next(error);
    }
  }
}
