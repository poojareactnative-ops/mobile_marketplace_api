"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemController = void 0;
const system_service_1 = require("../services/system.service");
const apiResponse_1 = require("../utils/apiResponse");
class SystemController {
    static async getVisitorAnalytics(req, res, next) {
        try {
            const period = req.query.period || '30d';
            const data = await system_service_1.SystemService.getVisitorAnalytics(period);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getSellerApplications(req, res, next) {
        try {
            const status = req.query.status;
            const data = await system_service_1.SystemService.getSellerApplications(status);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getSellerApplicationById(req, res, next) {
        try {
            const { id } = req.params;
            const data = await system_service_1.SystemService.getSellerApplicationById(id);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async approveSellerApplication(req, res, next) {
        try {
            const { id } = req.params;
            const systemUserId = req.user.userId;
            const data = await system_service_1.SystemService.approveSellerApplication(id, systemUserId);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async rejectSellerApplication(req, res, next) {
        try {
            const { id } = req.params;
            const systemUserId = req.user.userId;
            const { rejectionReason } = req.body;
            const data = await system_service_1.SystemService.rejectSellerApplication(id, systemUserId, rejectionReason);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getAllShops(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const search = req.query.search;
            const result = await system_service_1.SystemService.getAllShops(page, limit, search);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateShopStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { isActive, isVerified } = req.body;
            const data = await system_service_1.SystemService.updateShopStatus(id, isActive, isVerified);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getLandingPageSections(_req, res, next) {
        try {
            const data = await system_service_1.SystemService.getLandingPageSections();
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateLandingPageSection(req, res, next) {
        try {
            const { key } = req.body;
            const data = await system_service_1.SystemService.updateLandingPageSection(key, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.SystemController = SystemController;
