"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get('/health', (_req, res) => {
    return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API Routes mounted on /api/v1
app.use('/api/v1', routes_1.default);
// Global Error Handler
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
