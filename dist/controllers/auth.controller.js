"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const apiResponse_1 = require("../utils/apiResponse");
class AuthController {
    static async registerSeller(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.registerSeller(req.body);
            return (0, apiResponse_1.sendSuccess)(res, result, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            return (0, apiResponse_1.sendSuccess)(res, result, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.AuthService.refreshToken(refreshToken);
            return (0, apiResponse_1.sendSuccess)(res, result, 200);
        }
        catch (error) {
            return next(error);
        }
    }
    static async logout(_req, res) {
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Logged out successfully' }, 200);
    }
    static async getMe(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await auth_service_1.AuthService.getMe(userId);
            return (0, apiResponse_1.sendSuccess)(res, result, 200);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AuthController = AuthController;
