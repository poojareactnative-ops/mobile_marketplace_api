"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
function validateBody(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const fields = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.') || 'body';
                    fields[path] = err.message;
                });
                return next(apiError_1.ApiError.validationError('Validation failed', fields));
            }
            return next(error);
        }
    };
}
function validateQuery(schema) {
    return (req, _res, next) => {
        try {
            req.query = schema.parse(req.query);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const fields = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.') || 'query';
                    fields[path] = err.message;
                });
                return next(apiError_1.ApiError.validationError('Query parameter validation failed', fields));
            }
            return next(error);
        }
    };
}
