import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async registerSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerSeller(req.body);
      return sendSuccess(res, result, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      return sendSuccess(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async logout(_req: Request, res: Response) {
    return sendSuccess(res, { message: 'Logged out successfully' }, 200);
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await AuthService.getMe(userId);
      return sendSuccess(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body);
      return sendSuccess(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      return sendSuccess(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}

