import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.') || 'body';
          fields[path] = err.message;
        });
        return next(ApiError.validationError('Validation failed', fields));
      }
      return next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.') || 'query';
          fields[path] = err.message;
        });
        return next(ApiError.validationError('Query parameter validation failed', fields));
      }
      return next(error);
    }
  };
}
