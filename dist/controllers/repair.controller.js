"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairController = void 0;
const repair_service_1 = require("../services/repair.service");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
class RepairController {
    static getShopId(req) {
        if (!req.user?.shopId) {
            throw apiError_1.ApiError.forbidden('No active shop associated with user account');
        }
        return req.user.shopId;
    }
    static async createCustomer(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const data = await repair_service_1.RepairService.createCustomer(shopId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getCustomers(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const search = req.query.search;
            const result = await repair_service_1.RepairService.getCustomers(shopId, page, limit, search);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createRepairJob(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const authorUserId = req.user.userId;
            const data = await repair_service_1.RepairService.createRepairJob(shopId, authorUserId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getRepairJobs(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const status = req.query.status;
            const search = req.query.search;
            const result = await repair_service_1.RepairService.getRepairJobs(shopId, page, limit, status, search);
            return (0, apiResponse_1.sendPaginated)(res, result.data, result.meta, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getRepairJobById(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const { jobId } = req.params;
            const data = await repair_service_1.RepairService.getRepairJobById(shopId, jobId);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateRepairJob(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const { jobId } = req.params;
            const authorUserId = req.user.userId;
            const data = await repair_service_1.RepairService.updateRepairJob(shopId, jobId, authorUserId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async addRepairUpdate(req, res, next) {
        try {
            const shopId = RepairController.getShopId(req);
            const { jobId } = req.params;
            const authorUserId = req.user.userId;
            const data = await repair_service_1.RepairService.addRepairUpdate(shopId, jobId, authorUserId, req.body);
            return (0, apiResponse_1.sendSuccess)(res, data, 201);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.RepairController = RepairController;
