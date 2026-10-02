"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
class UploadController {
    static async presignUploadUrl(req, res) {
        const { filename, filetype } = req.body;
        const key = `uploads/${Date.now()}-${filename || 'image.png'}`;
        const uploadUrl = `https://storage.googleapis.com/mobile_marketplace_api-storage/${key}`;
        const publicUrl = `https://storage.googleapis.com/mobile_marketplace_api-storage/${key}`;
        return (0, apiResponse_1.sendSuccess)(res, {
            uploadUrl,
            publicUrl,
            key,
            expiresInSeconds: 900,
        });
    }
}
exports.UploadController = UploadController;
