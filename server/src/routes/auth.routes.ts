import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  verifyCode,
  createPassword,
  login,
  refreshToken,
  logout,
  forgotPassword,
} from '@/controllers/auth.controller';
import { validate } from '@/middleware/validation.middleware';
import {
  registerSchema,
  verifyCodeSchema,
  createPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
} from '@/utils/validators';
import { env } from '@/config/env';

const router = Router();

/**
 * Rate limiting для auth endpoints
 * Більш строгий, ніж загальний rate limiter
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 5, // Максимум 5 запитів з одного IP за 15 хвилин
  message: 'Забагато спроб. Спробуйте пізніше.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting для реєстрації та верифікації
 * Ще більш строгий для захисту від спаму
 * В development режимі ліміти збільшені для зручності тестування
 */
const registrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 година
  max: env.NODE_ENV === 'development' ? 20 : 3, // В development: 20 спроб, в production: 3
  message: 'Забагато спроб реєстрації. Спробуйте через годину.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/register
 * Реєстрація (відправка номера телефону)
 * - Валідація номера телефону
 * - Генерація та відправка SMS коду
 */
router.post(
  '/register',
  registrationRateLimiter, // Строгий rate limiting
  validate(registerSchema),
  register
);

/**
 * POST /api/auth/verify-code
 * Верифікація SMS коду
 * - Валідація коду
 * - Підтвердження номера телефону
 */
router.post(
  '/verify-code',
  registrationRateLimiter, // Строгий rate limiting
  validate(verifyCodeSchema),
  verifyCode
);

/**
 * POST /api/auth/create-password
 * Створення паролю (після верифікації)
 * - Валідація паролю
 * - Збереження користувача
 * - Генерація токенів
 */
router.post(
  '/create-password',
  authRateLimiter,
  validate(createPasswordSchema),
  createPassword
);

/**
 * POST /api/auth/login
 * Вхід в систему
 * - Валідація телефону та паролю
 * - Генерація токенів
 */
router.post('/login', authRateLimiter, validate(loginSchema), login);

/**
 * POST /api/auth/refresh-token
 * Оновлення access токену
 * - Валідація refresh токену
 * - Генерація нових токенів
 */
router.post(
  '/refresh-token',
  rateLimit({
    windowMs: 60 * 1000, // 1 хвилина
    max: 10, // Максимум 10 запитів на хвилину
    message: 'Забагато спроб оновлення токену. Спробуйте пізніше.',
  }),
  validate(refreshTokenSchema),
  refreshToken
);

/**
 * POST /api/auth/logout
 * Вихід з системи
 * - Видалення refresh токену
 */
router.post('/logout', validate(logoutSchema), logout);

/**
 * POST /api/auth/forgot-password
 * Відновлення паролю (відправка номера телефону)
 * - Валідація номера телефону
 * - Перевірка існування користувача
 * - Генерація та відправка SMS коду
 */
router.post(
  '/forgot-password',
  registrationRateLimiter, // Строгий rate limiting (як для реєстрації)
  validate(forgotPasswordSchema),
  forgotPassword
);

export default router;

