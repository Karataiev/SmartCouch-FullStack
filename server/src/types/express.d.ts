import { Request } from 'express';

/**
 * Розширення Express Request для додавання user після аутентифікації
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phone: string;
        isVerified: boolean;
      };
    }
  }
}

export {};
