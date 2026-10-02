import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { setupSwagger } from './docs/swagger';

const app: Application = express();

// Security Middlewares - disable CSP on docs to allow Swagger UI scripts/styles
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

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

// Root welcome with Swagger link
app.get('/', (_req, res) => {
  return res.status(200).json({
    name: 'Hyperlocal Mobile Marketplace REST API',
    version: '1.0.0',
    documentation: '/api-docs',
    specJson: '/api-docs.json',
    apiBase: '/api/v1',
  });
});

// Initialize Swagger Documentation at /api-docs and /api-docs.json
setupSwagger(app);

// API Routes mounted on /api/v1
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;

