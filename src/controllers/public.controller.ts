import { Request, Response, NextFunction } from 'express';
import { PublicService } from '../services/public.service';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';

export class PublicController {
  static async getLandingPage(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PublicService.getLandingPage();
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getNearbyShops(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const result = await PublicService.getNearbyShops(query);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const data = await PublicService.getFeaturedProducts(limit);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as string) || 'accessory';
      const data = await PublicService.getCategories(type);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getShopById(req: Request, res: Response, next: NextFunction) {
    try {
      const { shopId } = req.params;
      const data = await PublicService.getShopById(shopId);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getShopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { shopId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId as string;

      const result = await PublicService.getShopProducts(shopId, page, limit, search, categoryId);
      return sendPaginated(res, result.data, result.meta, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async createWhatsAppEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
      const userAgent = req.headers['user-agent'];
      const data = await PublicService.createWhatsAppEnquiry(req.body, ipAddress, userAgent);
      return sendSuccess(res, data, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async trackVisitor(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
      const data = await PublicService.trackVisitor(req.body, ipAddress);
      return sendSuccess(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }
}
