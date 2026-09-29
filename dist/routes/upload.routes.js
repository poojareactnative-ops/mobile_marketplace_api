"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/uploads/presign', auth_middleware_1.authenticate, upload_controller_1.UploadController.presignUploadUrl);
exports.default = router;
