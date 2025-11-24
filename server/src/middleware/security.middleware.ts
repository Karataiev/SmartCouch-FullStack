import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import { Request, Response, NextFunction } from 'express';

/**
 * Налаштування CORS
 */
export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

/**
 * Rate limiting для захисту від DDoS та brute-force
 */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Забагато запитів з цієї IP адреси, спробуйте пізніше',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Helmet для захисту HTTP заголовків
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Обмеження розміру body
 */
export const bodySizeLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.get('content-length');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength && parseInt(contentLength) > maxSize) {
    res.status(413).json({
      success: false,
      message: 'Розмір запиту перевищує 10MB',
    });
    return;
  }

  next();
};

