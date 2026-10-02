import { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swaggerSpec';

const customCss = `
  .swagger-ui .topbar {
    background-color: #0f172a;
    border-bottom: 2px solid #3b82f6;
    padding: 10px 0;
  }
  .swagger-ui .topbar-wrapper .link {
    color: #f8fafc;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: -0.025em;
  }
  .swagger-ui .info {
    margin: 25px 0;
  }
  .swagger-ui .info .title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.03em;
  }
  .swagger-ui .opblock.opblock-get {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  .swagger-ui .opblock.opblock-post {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }
  .swagger-ui .opblock.opblock-patch {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }
  .swagger-ui .opblock.opblock-delete {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }
  .swagger-ui .btn.authorize {
    background-color: #3b82f6;
    border-color: #3b82f6;
    color: #ffffff;
  }
  .swagger-ui .btn.authorize svg {
    fill: #ffffff;
  }
`;

export function setupSwagger(app: Application) {
  // Serve raw JSON spec
  app.get(['/api-docs.json', '/api/v1/api-docs.json'], (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss,
      customSiteTitle: 'Hyperlocal Mobile Marketplace - Swagger API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        tagsSorter: 'alpha',
      },
    })
  );

  // Friendly redirect for /docs
  app.get('/docs', (_req: Request, res: Response) => {
    res.redirect('/api-docs');
  });

  console.log('📖 Swagger documentation initialized at /api-docs and /api-docs.json');
}
