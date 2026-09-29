"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRoles = requireRoles;
exports.requireApproved = requireApproved;
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
const enums_1 = require("../types/enums");
function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(apiError_1.ApiError.unauthorized('Missing or invalid Authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = decoded;
        return next();
    }
    catch (error) {
        return next(apiError_1.ApiError.unauthorized('Invalid or expired token'));
    }
}
function requireRoles(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(apiError_1.ApiError.unauthorized());
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(apiError_1.ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`));
        }
        return next();
    };
}
function requireApproved(req, _res, next) {
    if (!req.user) {
        return next(apiError_1.ApiError.unauthorized());
    }
    if (req.user.role === enums_1.UserRole.SUPER_SELLER && req.user.status !== enums_1.UserStatus.APPROVED) {
        return next(apiError_1.ApiError.forbidden(req.user.status === enums_1.UserStatus.PENDING_APPROVAL
            ? 'Your Super Seller registration is pending System User approval.'
            : 'Your account has been rejected or suspended.'));
    }
    return next();
}
