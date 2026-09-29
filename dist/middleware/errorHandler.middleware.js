"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const apiError_1 = require("../utils/apiError");
function errorHandler(err, _req, res, _next) {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                fields: err.fields,
            },
        });
    }
    console.error('Unhandled Server Error:', err);
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message || 'Internal server error',
        },
    });
}
