import { Request, Response } from 'express';
import { WorkoutPlan, Client } from '@/models';
import { logger } from '@/config/logger';
import mongoose from 'mongoose';
import type {
  CreateWorkoutPlanInput,
  UpdateWorkoutPlanInput,
  DeleteOccurrenceInput,
} from '@/utils/validators';

/**
 * GET /api/workout-plans
 * Отримати список планів тренувань поточного тренера
 *
 * Query параметри:
 * - page: номер сторінки (за замовчуванням 1)
 * - limit: кількість на сторінці (за замовчуванням 20)
 * - date: фільтр за датою (ISO формат, наприклад, 2024-01-15)
 * - clientId: фільтр за клієнтом
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Застосовуємо фільтри та пагінацію
 * 3. Повертаємо список планів
 */
export const getWorkoutPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trainerId = req.user?.id;

    if (!trainerId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    // Пагінація
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Фільтри
    const date = req.query.date as string | undefined;
    const clientId = req.query.clientId as string | undefined;

    // Побудова запиту
    const query: any = { trainerId: new mongoose.Types.ObjectId(trainerId) };

    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      query.clientId = new mongoose.Types.ObjectId(clientId);
    }

    // Фільтр за датою (перевіряємо в occurrences)
    if (date) {
      try {
        const filterDate = new Date(date);
        filterDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(filterDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Шукаємо плани, де є occurrences з цією датою
        query['occurrences.trainingDate'] = {
          $gte: filterDate,
          $lt: nextDay,
        };
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Невірний формат дати. Використовуйте ISO формат (YYYY-MM-DD)',
        });
        return;
      }
    }

    // Виконання запиту
    const [workoutPlans, total] = await Promise.all([
      WorkoutPlan.find(query)
        .populate('clientId', 'name surname phone') // Додаємо інформацію про клієнта
        .sort({ createdAt: -1 }) // Найновіші спочатку
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkoutPlan.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        workoutPlans,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання списку планів тренувань');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * GET /api/workout-plans/:id
 * Отримати деталі плану тренування
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkWorkoutPlanOwner)
 * 2. Повертаємо дані плану
 */
export const getWorkoutPlanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workoutPlan = req.workoutPlan; // Додано через checkWorkoutPlanOwner middleware

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'План тренування не знайдений',
      });
      return;
    }

    // Популюємо інформацію про клієнта
    await workoutPlan.populate('clientId', 'name surname phone');

    res.status(200).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання плану тренування');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/workout-plans
 * Створити новий план тренування
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Перевіряємо, що клієнт належить тренеру
 * 3. Валідація даних (вже зроблено через middleware)
 * 4. Створюємо план
 * 5. Повертаємо створений план
 */
export const createWorkoutPlan = async (
  req: Request<{}, {}, CreateWorkoutPlanInput>,
  res: Response
): Promise<void> => {
  try {
    const trainerId = req.user?.id;

    if (!trainerId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    const { clientId, trainingName, trainingType, location, trainingDate, occurrences = [] } = req.body;

    // Перевірка, що клієнт належить тренеру
    const client = await Client.findOne({
      _id: new mongoose.Types.ObjectId(clientId),
      trainerId: new mongoose.Types.ObjectId(trainerId),
    });

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений або не належить вам',
      });
      return;
    }

    // Створення плану тренування
    const workoutPlan = await WorkoutPlan.create({
      trainerId: new mongoose.Types.ObjectId(trainerId),
      clientId: new mongoose.Types.ObjectId(clientId),
      trainingName,
      trainingType: trainingType || undefined,
      location: location || undefined,
      trainingDate,
      occurrences,
    });

    logger.info({ trainerId, workoutPlanId: workoutPlan._id, clientId }, 'План тренування створено');

    // Популюємо інформацію про клієнта
    await workoutPlan.populate('clientId', 'name surname phone');

    res.status(201).json({
      success: true,
      message: 'План тренування створено успішно',
      data: workoutPlan,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка створення плану тренування');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * PUT /api/workout-plans/:id
 * Оновити план тренування
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkWorkoutPlanOwner)
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Оновлюємо план
 * 4. Повертаємо оновлений план
 */
export const updateWorkoutPlan = async (
  req: Request<{ id: string }, {}, UpdateWorkoutPlanInput>,
  res: Response
): Promise<void> => {
  try {
    const workoutPlan = req.workoutPlan; // Додано через checkWorkoutPlanOwner middleware

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'План тренування не знайдений',
      });
      return;
    }

    const { trainingName, trainingType, location, trainingDate, occurrences } = req.body;

    // Оновлення полів (тільки якщо вони надані)
    if (trainingName !== undefined && trainingName !== '') {
      workoutPlan.trainingName = trainingName;
    }
    if (trainingType !== undefined) {
      workoutPlan.trainingType = trainingType === '' ? undefined : trainingType;
    }
    if (location !== undefined) {
      workoutPlan.location = location === '' ? undefined : location;
    }
    if (trainingDate !== undefined) {
      workoutPlan.trainingDate = trainingDate;
    }
    if (occurrences !== undefined) {
      workoutPlan.occurrences = occurrences;
    }

    await workoutPlan.save();

    logger.info({ workoutPlanId: workoutPlan._id, updatedFields: Object.keys(req.body) }, 'План тренування оновлено');

    // Популюємо інформацію про клієнта
    await workoutPlan.populate('clientId', 'name surname phone');

    res.status(200).json({
      success: true,
      message: 'План тренування оновлено успішно',
      data: workoutPlan,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка оновлення плану тренування');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * DELETE /api/workout-plans/:id
 * Видалити план тренування
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkWorkoutPlanOwner)
 * 2. Видаляємо план
 * 3. Повертаємо підтвердження
 */
export const deleteWorkoutPlan = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const workoutPlan = req.workoutPlan; // Додано через checkWorkoutPlanOwner middleware

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'План тренування не знайдений',
      });
      return;
    }

    const workoutPlanId = workoutPlan._id;

    logger.info({ workoutPlanId, trainerId: workoutPlan.trainerId }, 'Видалення плану тренування');

    await WorkoutPlan.deleteOne({ _id: workoutPlanId });

    res.status(200).json({
      success: true,
      message: 'План тренування видалено успішно',
    });
  } catch (error) {
    logger.error({ error }, 'Помилка видалення плану тренування');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * DELETE /api/workout-plans/:id/occurrence
 * Видалити окреме тренування (occurrence) з плану
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkWorkoutPlanOwner)
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Видаляємо occurrence з плану
 * 4. Оновлюємо trainingDate (видаляємо відповідну дату)
 * 5. Повертаємо оновлений план
 */
export const deleteOccurrence = async (
  req: Request<{ id: string }, {}, DeleteOccurrenceInput>,
  res: Response
): Promise<void> => {
  try {
    const workoutPlan = req.workoutPlan; // Додано через checkWorkoutPlanOwner middleware

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'План тренування не знайдений',
      });
      return;
    }

    const { occurrenceId, date } = req.body;

    if (!occurrenceId) {
      res.status(400).json({
        success: false,
        message: 'ID occurrence обов\'язковий',
      });
      return;
    }

    // Видаляємо occurrence з масиву
    const initialOccurrencesCount = workoutPlan.occurrences.length;
    workoutPlan.occurrences = workoutPlan.occurrences.filter(
      (occ) => occ.id !== occurrenceId
    );

    // Якщо occurrence не знайдено
    if (workoutPlan.occurrences.length === initialOccurrencesCount) {
      res.status(404).json({
        success: false,
        message: 'Occurrence не знайдено',
      });
      return;
    }

    // Якщо надано дату, видаляємо відповідну дату з trainingDate
    if (date) {
      try {
        const filterDate = new Date(date);
        filterDate.setHours(0, 0, 0, 0);

        // Видаляємо дати, які відповідають фільтру
        workoutPlan.trainingDate = workoutPlan.trainingDate.filter((td: any) => {
          // Якщо це об'єкт з date
          if (typeof td === 'object' && td.date) {
            const tdDate = new Date(td.date);
            tdDate.setHours(0, 0, 0, 0);
            return tdDate.getTime() !== filterDate.getTime();
          }
          // Якщо це Date або рядок
          const tdDate = new Date(td);
          tdDate.setHours(0, 0, 0, 0);
          return tdDate.getTime() !== filterDate.getTime();
        });
      } catch (error) {
        // Якщо помилка парсингу дати, просто продовжуємо
        logger.warn({ error, date }, 'Помилка парсингу дати при видаленні occurrence');
      }
    }

    // Якщо після видалення не залишилося occurrences або дат, видаляємо весь план
    if (workoutPlan.occurrences.length === 0 || workoutPlan.trainingDate.length === 0) {
      await WorkoutPlan.deleteOne({ _id: workoutPlan._id });
      logger.info({ workoutPlanId: workoutPlan._id }, 'План тренування видалено (не залишилося occurrences)');

      res.status(200).json({
        success: true,
        message: 'Occurrence видалено. План тренування також видалено, оскільки не залишилося тренувань',
      });
      return;
    }

    await workoutPlan.save();

    logger.info({ workoutPlanId: workoutPlan._id, occurrenceId }, 'Occurrence видалено з плану');

    // Популюємо інформацію про клієнта
    await workoutPlan.populate('clientId', 'name surname phone');

    res.status(200).json({
      success: true,
      message: 'Occurrence видалено успішно',
      data: workoutPlan,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка видалення occurrence');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

