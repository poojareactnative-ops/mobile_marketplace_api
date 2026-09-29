import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        fields: err.fields,
      },
    });
  }

  console.error('Unhandled Server Error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message || 'Internal server error',
    },
  });
}
