"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerController = void 0;
const seller_service_1 = require("../services/seller.service");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
class SellerController {
    static getShopId(req) {
        if (!req.user?.shopId) {
            throw apiError_1.ApiError.forbidden('No active shop associated with user account');
        }
        return req.user.shopId;
    }
    static async getDashboardSummary(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const period = req.query.period || '30d';
            const data = await seller_service_1.SellerService.getDashboardSummary(shopId, period);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getProducts(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const query = req.query;
            const result = await seller_service_1.SellerService.getProducts(shopId, query);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createProduct(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const data = await seller_service_1.SellerService.createProduct(shopId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getProductById(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const { productId } = req.params;
            const data = await seller_service_1.SellerService.getProductById(shopId, productId);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const { productId } = req.params;
            const data = await seller_service_1.SellerService.updateProduct(shopId, productId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const { productId } = req.params;
            const data = await seller_service_1.SellerService.deleteProduct(shopId, productId);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getEnquiries(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const result = await seller_service_1.SellerService.getEnquiries(shopId, page, limit);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getShopProfile(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const data = await seller_service_1.SellerService.getShopProfile(shopId);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateShopProfile(req, res, next) {
        try {
            const shopId = SellerController.getShopId(req);
            const data = await seller_service_1.SellerService.updateShopProfile(shopId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.SellerController = SellerController;
