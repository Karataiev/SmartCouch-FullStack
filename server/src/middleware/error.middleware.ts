import { Request, Response, NextFunction } from 'express';
import { logger } from '@/config/logger';
import { env } from '@/config/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Обробка помилок
 */
export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутрішня помилка сервера';

  // Логування помилки
  logger.error(
    {
      error: err,
      statusCode,
      path: req.path,
      method: req.method,
    },
    'Помилка обробки запиту'
  );

  // Відповідь клієнту
  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Обробка 404
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.method} ${req.path} не знайдено`,
  });
};

