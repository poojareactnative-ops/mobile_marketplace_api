import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req, res) => {
  return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes mounted on /api/v1
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
