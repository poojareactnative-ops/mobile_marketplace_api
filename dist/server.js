"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
async function startServer() {
    try {
        await prisma_1.prisma.$connect();
        console.log('Database connected successfully via Prisma');
        const server = app_1.default.listen(env_1.env.PORT, () => {
            console.log(`🚀 EMP-API server running on http://localhost:${env_1.env.PORT}`);
            console.log(`📌 API Base Endpoint: http://localhost:${env_1.env.PORT}/api/v1`);
        });
        const shutdown = async () => {
            console.log('Shutting down server gracefully...');
            server.close(async () => {
                await prisma_1.prisma.$disconnect();
                console.log('Database connection closed.');
                process.exit(0);
            });
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
