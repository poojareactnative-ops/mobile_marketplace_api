import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully via Prisma');

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 mobile_marketplace_api server running on http://localhost:${env.PORT}`);
      console.log(`📌 API Base Endpoint: http://localhost:${env.PORT}/api/v1`);
    });

    const shutdown = async () => {
      console.log('Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
