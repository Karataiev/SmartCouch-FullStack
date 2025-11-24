import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@/config/logger';

/**
 * Middleware для валідації body запиту за Zod схемою
 *
 * Як працює:
 * 1. Отримує Zod схему як параметр
 * 2. Валідує req.body за цією схемою
 * 3. Якщо валідація не пройдена - повертає 400 з деталями помилок
 * 4. Якщо валідація пройдена - замінює req.body на типізовані дані та передає далі
 *
 * @param schema - Zod схема для валідації
 * @returns Express middleware функцію
 *
 * @example
 * router.post('/register', validate(registerSchema), registerController);
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Валідація body за схемою
      // safeParse не викидає помилку, а повертає результат
      const result = schema.safeParse(req.body);

      // Якщо валідація не пройдена
      if (!result.success) {
        // Форматування помилок для відповіді
        const error = result.error as ZodError;
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'), // Шлях до поля (наприклад, "phone" або "password")
          message: issue.message, // Повідомлення про помилку
        }));

        // Логування помилки валідації (для моніторингу)
        logger.warn(
          {
            path: req.path,
            method: req.method,
            errors,
            body: req.body,
          },
          'Помилка валідації запиту'
        );

        // Відповідь клієнту з деталями помилок
        res.status(400).json({
          success: false,
          message: 'Помилка валідації даних',
          errors,
        });
        return;
      }

      // Якщо валідація пройдена - замінюємо req.body на типізовані дані
      // Це важливо, бо Zod може трансформувати дані (наприклад, нормалізувати телефон)
      req.body = result.data;

      // Передаємо обробку далі
      next();
    } catch (error) {
      // Обробка несподіваних помилок (на випадок, якщо щось пішло не так)
      logger.error(
        {
          error,
          path: req.path,
          method: req.method,
        },
        'Несподівана помилка при валідації'
      );

      res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера при валідації',
      });
    }
  };
};

/**
 * Валідація query параметрів
 * Використовується для GET запитів з параметрами (наприклад, пагінація, фільтри)
 *
 * @param schema - Zod схема для валідації query параметрів
 * @returns Express middleware функцію
 *
 * @example
 * router.get('/clients', validateQuery(paginationSchema), getClientsController);
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const error = result.error as ZodError;
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        logger.warn(
          {
            path: req.path,
            method: req.method,
            errors,
            query: req.query,
          },
          'Помилка валідації query параметрів'
        );

        res.status(400).json({
          success: false,
          message: 'Помилка валідації query параметрів',
          errors,
        });
        return;
      }

      // Замінюємо req.query на типізовані дані
      req.query = result.data as any; // TypeScript не знає тип query, тому any

      next();
    } catch (error) {
      logger.error(
        {
          error,
          path: req.path,
          method: req.method,
        },
        'Несподівана помилка при валідації query'
      );

      res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера при валідації',
      });
    }
  };
};

/**
 * Валідація params (динамічні параметри в URL)
 * Використовується для перевірки ID та інших параметрів в URL
 *
 * @param schema - Zod схема для валідації params
 * @returns Express middleware функцію
 *
 * @example
 * router.get('/clients/:id', validateParams(z.object({ id: z.string().min(1) })), getClientController);
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const error = result.error as ZodError;
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        logger.warn(
          {
            path: req.path,
            method: req.method,
            errors,
            params: req.params,
          },
          'Помилка валідації params'
        );

        res.status(400).json({
          success: false,
          message: 'Помилка валідації параметрів URL',
          errors,
        });
        return;
      }

      // Замінюємо req.params на типізовані дані
      req.params = result.data as any;

      next();
    } catch (error) {
      logger.error(
        {
          error,
          path: req.path,
          method: req.method,
        },
        'Несподівана помилка при валідації params'
      );

      res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера при валідації',
      });
    }
  };
};

