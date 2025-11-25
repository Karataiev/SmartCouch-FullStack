import { Router } from 'express';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getTemplates,
  cloneProgram,
} from '@/controllers/programs.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { checkProgramOwner } from '@/middleware/owner.middleware';
import { validate } from '@/middleware/validation.middleware';
import {
  createProgramSchema,
  updateProgramSchema,
} from '@/utils/validators';

const router = Router();

/**
 * Всі роути програм вимагають аутентифікації
 * Використовуємо authenticate middleware для захисту
 */
router.use(authenticate);

/**
 * GET /api/programs
 * Отримати список програм поточного тренера
 * - Захищений роут (потрібен JWT токен)
 * - Query параметри: page, limit, isTemplate
 * - Повертає тільки програми поточного тренера
 */
router.get('/', getPrograms);

/**
 * GET /api/programs/templates
 * Отримати список шаблонів (програм з isTemplate = true)
 * - Захищений роут (потрібен JWT токен)
 * - Query параметри: page, limit
 * - Повертає тільки шаблони поточного тренера
 */
router.get('/templates', getTemplates);

/**
 * GET /api/programs/:id
 * Отримати деталі програми
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkProgramOwner
 */
router.get('/:id', checkProgramOwner, getProgramById);

/**
 * POST /api/programs
 * Створити нову програму
 * - Захищений роут (потрібен JWT токен)
 * - Валідація даних через middleware
 * - Автоматично призначає trainerId з req.user
 */
router.post('/', validate(createProgramSchema), createProgram);

/**
 * PUT /api/programs/:id
 * Оновити програму
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkProgramOwner
 * - Валідація даних через middleware
 * - Оновлює тільки надані поля
 */
router.put('/:id', checkProgramOwner, validate(updateProgramSchema), updateProgram);

/**
 * DELETE /api/programs/:id
 * Видалити програму
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkProgramOwner
 * - УВАГА: Операція незворотна!
 */
router.delete('/:id', checkProgramOwner, deleteProgram);

/**
 * POST /api/programs/:id/clone
 * Клонувати програму
 * - Захищений роут (потрібен JWT токен)
 * - Перевірка власника через checkProgramOwner
 * - Створює копію програми з новим ID
 * - Клонована програма не є шаблоном (isTemplate = false)
 */
router.post('/:id/clone', checkProgramOwner, cloneProgram);

export default router;

