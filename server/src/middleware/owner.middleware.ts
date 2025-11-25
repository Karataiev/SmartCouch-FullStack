import { Request, Response, NextFunction } from 'express';
import { Client, WorkoutPlan, Program } from '@/models';
import { logger } from '@/config/logger';
import mongoose from 'mongoose';

/**
 * Middleware для перевірки, що користувач є власником клієнта
 * Використовується для захисту ресурсів клієнтів
 *
 * Як працює:
 * 1. Отримує clientId з параметрів запиту (req.params.id)
 * 2. Знаходить клієнта в БД
 * 3. Перевіряє, що trainerId клієнта співпадає з userId з req.user
 * 4. Якщо не співпадає - повертає 403 Forbidden
 *
 * @example
 * router.put('/clients/:id', authenticate, checkClientOwner, updateClient);
 */
export const checkClientOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const clientId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    if (!clientId) {
      res.status(400).json({
        success: false,
        message: 'ID клієнта не надано',
      });
      return;
    }

    // Перевірка валідності ObjectId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      res.status(400).json({
        success: false,
        message: 'Невірний формат ID клієнта',
      });
      return;
    }

    // Пошук клієнта в БД
    const client = await Client.findById(clientId);

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    // Перевірка власника
    if (client.trainerId.toString() !== userId) {
      logger.warn(
        {
          userId,
          clientId,
          clientTrainerId: client.trainerId.toString(),
        },
        'Спроба доступу до клієнта іншого тренера'
      );
      res.status(403).json({
        success: false,
        message: 'Доступ заборонено. Цей клієнт належить іншому тренеру',
      });
      return;
    }

    // Додаємо клієнта до request для використання в контролері (опціонально)
    req.client = client;

    // Передача обробки далі
    next();
  } catch (error) {
    logger.error({ error }, 'Помилка перевірки власника клієнта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера при перевірці доступу',
    });
  }
};

/**
 * Middleware для перевірки, що користувач є власником плану тренування
 * Використовується для захисту ресурсів планів тренувань
 *
 * Як працює:
 * 1. Отримує workoutPlanId з параметрів запиту (req.params.id)
 * 2. Знаходить план тренування в БД
 * 3. Перевіряє, що trainerId плану співпадає з userId з req.user
 * 4. Якщо не співпадає - повертає 403 Forbidden
 *
 * @example
 * router.put('/workout-plans/:id', authenticate, checkWorkoutPlanOwner, updateWorkoutPlan);
 */
export const checkWorkoutPlanOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const workoutPlanId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    if (!workoutPlanId) {
      res.status(400).json({
        success: false,
        message: 'ID плану тренування не надано',
      });
      return;
    }

    // Перевірка валідності ObjectId
    if (!mongoose.Types.ObjectId.isValid(workoutPlanId)) {
      res.status(400).json({
        success: false,
        message: 'Невірний формат ID плану тренування',
      });
      return;
    }

    // Пошук плану тренування в БД
    const workoutPlan = await WorkoutPlan.findById(workoutPlanId);

    if (!workoutPlan) {
      res.status(404).json({
        success: false,
        message: 'План тренування не знайдений',
      });
      return;
    }

    // Перевірка власника
    if (workoutPlan.trainerId.toString() !== userId) {
      logger.warn(
        {
          userId,
          workoutPlanId,
          planTrainerId: workoutPlan.trainerId.toString(),
        },
        'Спроба доступу до плану тренування іншого тренера'
      );
      res.status(403).json({
        success: false,
        message: 'Доступ заборонено. Цей план тренування належить іншому тренеру',
      });
      return;
    }

    // Додаємо план тренування до request для використання в контролері (опціонально)
    req.workoutPlan = workoutPlan;

    // Передача обробки далі
    next();
  } catch (error) {
    logger.error({ error }, 'Помилка перевірки власника плану тренування');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера при перевірці доступу',
    });
  }
};

/**
 * Middleware для перевірки, що користувач є власником програми
 * Використовується для захисту ресурсів програм
 *
 * Як працює:
 * 1. Отримує programId з параметрів запиту (req.params.id)
 * 2. Знаходить програму в БД
 * 3. Перевіряє, що trainerId програми співпадає з userId з req.user
 * 4. Якщо не співпадає - повертає 403 Forbidden
 *
 * @example
 * router.put('/programs/:id', authenticate, checkProgramOwner, updateProgram);
 */
export const checkProgramOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const programId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    if (!programId) {
      res.status(400).json({
        success: false,
        message: 'ID програми не надано',
      });
      return;
    }

    // Перевірка валідності ObjectId
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      res.status(400).json({
        success: false,
        message: 'Невірний формат ID програми',
      });
      return;
    }

    // Пошук програми в БД
    const program = await Program.findById(programId);

    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Програма не знайдена',
      });
      return;
    }

    // Перевірка власника
    if (program.trainerId.toString() !== userId) {
      logger.warn(
        {
          userId,
          programId,
          programTrainerId: program.trainerId.toString(),
        },
        'Спроба доступу до програми іншого тренера'
      );
      res.status(403).json({
        success: false,
        message: 'Доступ заборонено. Ця програма належить іншому тренеру',
      });
      return;
    }

    // Додаємо програму до request для використання в контролері (опціонально)
    req.program = program;

    // Передача обробки далі
    next();
  } catch (error) {
    logger.error({ error }, 'Помилка перевірки власника програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера при перевірці доступу',
    });
  }
};

