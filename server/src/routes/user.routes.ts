import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount } from '@/controllers/user.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validation.middleware';
import { updateProfileSchema } from '@/utils/validators';

const router = Router();

/**
 * Всі роути профілю користувача вимагають аутентифікації
 * Використовуємо authenticate middleware для захисту
 */
router.use(authenticate);

/**
 * GET /api/user/profile
 * Отримати профіль поточного користувача
 * - Захищений роут (потрібен JWT токен)
 * - Повертає всі дані профілю (без пароля)
 */
router.get('/profile', getProfile);

/**
 * PUT /api/user/profile
 * Оновити профіль поточного користувача
 * - Захищений роут (потрібен JWT токен)
 * - Валідація даних через middleware
 * - Оновлює тільки надані поля
 */
router.put('/profile', validate(updateProfileSchema), updateProfile);

/**
 * DELETE /api/user/account
 * Видалити акаунт поточного користувача
 * - Захищений роут (потрібен JWT токен)
 * - Видаляє користувача та всі його refresh токени
 * - УВАГА: Операція незворотна!
 */
router.delete('/account', deleteAccount);

export default router;

