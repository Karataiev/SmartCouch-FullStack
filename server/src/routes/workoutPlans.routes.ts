import { Router } from 'express';
import {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  deleteOccurrence,
} from '@/controllers/workoutPlans.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { checkWorkoutPlanOwner } from '@/middleware/owner.middleware';
import { validate } from '@/middleware/validation.middleware';
import {
  createWorkoutPlanSchema,
  updateWorkoutPlanSchema,
  deleteOccurrenceSchema,
} from '@/utils/validators';

const router = Router();

/**
 * Всі роути планів тренувань вимагають аутентифікації
 * Використовуємо authenticate middleware для захисту
 */
router.use(authenticate);

/**
 * GET /api/workout-plans
 * Отримати список планів тренувань поточного тренера
 * - Захищений роут (потрібен JWT токен)
 * - Query параметри: page, limit, date, clientId
 * - Повертає тільки плани поточного тренера
 */
router.get('/', getWorkoutPlans);

/**
 * GET /api/workout-plans/:id
 * Отримати деталі плану тренування
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkWorkoutPlanOwner
 */
router.get('/:id', checkWorkoutPlanOwner, getWorkoutPlanById);

/**
 * POST /api/workout-plans
 * Створити новий план тренування
 * - Захищений роут (потрібен JWT токен)
 * - Валідація даних через middleware
 * - Автоматично призначає trainerId з req.user
 * - Перевіряє, що клієнт належить тренеру
 */
router.post('/', validate(createWorkoutPlanSchema), createWorkoutPlan);

/**
 * PUT /api/workout-plans/:id
 * Оновити план тренування
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkWorkoutPlanOwner
 * - Валідація даних через middleware
 * - Оновлює тільки надані поля
 */
router.put('/:id', checkWorkoutPlanOwner, validate(updateWorkoutPlanSchema), updateWorkoutPlan);

/**
 * DELETE /api/workout-plans/:id
 * Видалити план тренування
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkWorkoutPlanOwner
 * - УВАГА: Операція незворотна!
 */
router.delete('/:id', checkWorkoutPlanOwner, deleteWorkoutPlan);

/**
 * DELETE /api/workout-plans/:id/occurrence
 * Видалити окреме тренування (occurrence) з плану
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkWorkoutPlanOwner
 * - Валідація даних через middleware
 * - Якщо після видалення не залишилося occurrences, видаляє весь план
 */
router.delete('/:id/occurrence', checkWorkoutPlanOwner, validate(deleteOccurrenceSchema), deleteOccurrence);

export default router;

