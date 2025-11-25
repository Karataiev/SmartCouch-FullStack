import { Router } from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  updateParameters,
  assignProgram,
  getClientTrainings,
} from '@/controllers/clients.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { checkClientOwner } from '@/middleware/owner.middleware';
import { validate } from '@/middleware/validation.middleware';
import {
  createClientSchema,
  updateClientSchema,
  updateClientParametersSchema,
  assignProgramSchema,
} from '@/utils/validators';

const router = Router();

/**
 * Всі роути клієнтів вимагають аутентифікації
 * Використовуємо authenticate middleware для захисту
 */
router.use(authenticate);

/**
 * GET /api/clients
 * Отримати список клієнтів поточного тренера
 * - Захищений роут (потрібен JWT токен)
 * - Query параметри: page, limit, search
 * - Повертає тільки клієнтів поточного тренера
 */
router.get('/', getClients);

/**
 * GET /api/clients/:id
 * Отримати деталі клієнта
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkClientOwner
 */
router.get('/:id', checkClientOwner, getClientById);

/**
 * POST /api/clients
 * Створити нового клієнта
 * - Захищений роут (потрібен JWT токен)
 * - Валідація даних через middleware
 * - Автоматично призначає trainerId з req.user
 */
router.post('/', validate(createClientSchema), createClient);

/**
 * PUT /api/clients/:id
 * Оновити клієнта
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkClientOwner
 * - Валідація даних через middleware
 * - Оновлює тільки надані поля
 */
router.put('/:id', checkClientOwner, validate(updateClientSchema), updateClient);

/**
 * DELETE /api/clients/:id
 * Видалити клієнта
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkClientOwner
 * - УВАГА: Операція незворотна!
 */
router.delete('/:id', checkClientOwner, deleteClient);

/**
 * PUT /api/clients/:id/parameters
 * Оновити параметри клієнта
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkClientOwner
 * - Валідація даних через middleware
 */
router.put(
  '/:id/parameters',
  checkClientOwner,
  validate(updateClientParametersSchema),
  updateParameters
);

/**
 * PUT /api/clients/:id/program
 * Призначити програму клієнту
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkClientOwner
 * - Валідація даних через middleware
 */
router.put(
  '/:id/program',
  checkClientOwner,
  validate(assignProgramSchema),
  assignProgram
);

/**
 * GET /api/clients/:id/trainings
 * Отримати тренування клієнта
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkClientOwner
 * - TODO: Повністю реалізувати після створення WorkoutPlan моделі
 */
router.get('/:id/trainings', checkClientOwner, getClientTrainings);

export default router;

