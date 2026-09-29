"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendPaginated = sendPaginated;
function sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json({ data });
}
function sendPaginated(res, data, meta, statusCode = 200) {
    const totalPages = Math.ceil(meta.total / meta.limit) || 1;
    return res.status(statusCode).json({
        data,
        meta: {
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            totalPages,
        },
    });
}
