"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    code;
    fields;
    constructor(statusCode, code, message, fields) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.fields = fields;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static badRequest(message, fields) {
        return new ApiError(400, 'BAD_REQUEST', message, fields);
    }
    static validationError(message, fields) {
        return new ApiError(422, 'VALIDATION_ERROR', message, fields);
    }
    static unauthorized(message = 'Authentication required') {
        return new ApiError(401, 'UNAUTHORIZED', message);
    }
    static forbidden(message = 'Access denied') {
        return new ApiError(403, 'FORBIDDEN', message);
    }
    static notFound(message = 'Resource not found') {
        return new ApiError(404, 'NOT_FOUND', message);
    }
    static conflict(message) {
        return new ApiError(409, 'CONFLICT', message);
    }
    static internal(message = 'Internal server error') {
        return new ApiError(500, 'INTERNAL_SERVER_ERROR', message);
    }
}
exports.ApiError = ApiError;
