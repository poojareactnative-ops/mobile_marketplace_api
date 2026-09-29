"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const public_service_1 = require("../services/public.service");
const apiResponse_1 = require("../utils/apiResponse");
class PublicController {
    static async getLandingPage(_req, res, next) {
        try {
            const data = await public_service_1.PublicService.getLandingPage();
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getNearbyShops(req, res, next) {
        try {
            const query = req.query;
            const result = await public_service_1.PublicService.getNearbyShops(query);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getFeaturedProducts(req, res, next) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
            const data = await public_service_1.PublicService.getFeaturedProducts(limit);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getCategories(req, res, next) {
        try {
            const type = req.query.type || 'accessory';
            const data = await public_service_1.PublicService.getCategories(type);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getShopById(req, res, next) {
        try {
            const { shopId } = req.params;
            const data = await public_service_1.PublicService.getShopById(shopId);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getShopProducts(req, res, next) {
        try {
            const { shopId } = req.params;
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const search = req.query.search;
            const categoryId = req.query.categoryId;
            const result = await public_service_1.PublicService.getShopProducts(shopId, page, limit, search, categoryId);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createWhatsAppEnquiry(req, res, next) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1';
            const userAgent = req.headers['user-agent'];
            const data = await public_service_1.PublicService.createWhatsAppEnquiry(req.body, ipAddress, userAgent);
            return (0, apiResponse_1.sendSuccess)(res, data, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async trackVisitor(req, res, next) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1';
            const data = await public_service_1.PublicService.trackVisitor(req.body, ipAddress);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.PublicController = PublicController;
