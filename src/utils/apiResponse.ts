import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

export function sendPaginated<T>(res: Response, data: T[], meta: PaginationMeta, statusCode = 200) {
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;
  return res.status(statusCode).json({
    data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages,
    },
  });
}
