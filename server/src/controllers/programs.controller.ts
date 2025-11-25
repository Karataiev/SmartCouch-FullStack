import { Request, Response } from 'express';
import { Program } from '@/models';
import { logger } from '@/config/logger';
import mongoose from 'mongoose';
import type {
  CreateProgramInput,
  UpdateProgramInput,
} from '@/utils/validators';

/**
 * GET /api/programs
 * Отримати список програм поточного тренера
 *
 * Query параметри:
 * - page: номер сторінки (за замовчуванням 1)
 * - limit: кількість на сторінці (за замовчуванням 20)
 * - isTemplate: фільтр за шаблонами (true/false)
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Застосовуємо фільтри та пагінацію
 * 3. Повертаємо список програм
 */
export const getPrograms = async (
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
    const isTemplate = req.query.isTemplate as string | undefined;

    // Побудова запиту
    const query: any = { trainerId: new mongoose.Types.ObjectId(trainerId) };

    // Фільтр за шаблонами
    if (isTemplate !== undefined) {
      query.isTemplate = isTemplate === 'true';
    }

    // Виконання запиту
    const [programs, total] = await Promise.all([
      Program.find(query)
        .sort({ createdAt: -1 }) // Найновіші спочатку
        .skip(skip)
        .limit(limit)
        .lean(),
      Program.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        programs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання списку програм');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * GET /api/programs/templates
 * Отримати список шаблонів (програм з isTemplate = true)
 *
 * Query параметри:
 * - page: номер сторінки (за замовчуванням 1)
 * - limit: кількість на сторінці (за замовчуванням 20)
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Шукаємо програми з isTemplate = true
 * 3. Повертаємо список шаблонів
 */
export const getTemplates = async (
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

    // Запит для шаблонів поточного тренера
    const query = {
      trainerId: new mongoose.Types.ObjectId(trainerId),
      isTemplate: true,
    };

    // Виконання запиту
    const [templates, total] = await Promise.all([
      Program.find(query)
        .sort({ createdAt: -1 }) // Найновіші спочатку
        .skip(skip)
        .limit(limit)
        .lean(),
      Program.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        templates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання списку шаблонів');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * GET /api/programs/:id
 * Отримати деталі програми
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkProgramOwner)
 * 2. Повертаємо дані програми
 */
export const getProgramById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const program = req.program; // Додано через checkProgramOwner middleware

    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Програма не знайдена',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/programs
 * Створити нову програму
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Створюємо програму
 * 4. Повертаємо створену програму
 */
export const createProgram = async (
  req: Request<{}, {}, CreateProgramInput>,
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

    const { title, description, exercises = [], isTemplate = false } = req.body;

    // Створення програми
    const program = await Program.create({
      trainerId: new mongoose.Types.ObjectId(trainerId),
      title,
      description: description || undefined,
      exercises,
      isTemplate,
    });

    logger.info({ trainerId, programId: program._id, isTemplate }, 'Програма створено');

    res.status(201).json({
      success: true,
      message: 'Програма створена успішно',
      data: program,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка створення програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * PUT /api/programs/:id
 * Оновити програму
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkProgramOwner)
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Оновлюємо програму
 * 4. Повертаємо оновлену програму
 */
export const updateProgram = async (
  req: Request<{ id: string }, {}, UpdateProgramInput>,
  res: Response
): Promise<void> => {
  try {
    const program = req.program; // Додано через checkProgramOwner middleware

    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Програма не знайдена',
      });
      return;
    }

    const { title, description, exercises, isTemplate } = req.body;

    // Оновлення полів (тільки якщо вони надані)
    if (title !== undefined && title !== '') {
      program.title = title;
    }
    if (description !== undefined) {
      program.description = description === '' ? undefined : description;
    }
    if (exercises !== undefined) {
      program.exercises = exercises;
    }
    if (isTemplate !== undefined) {
      program.isTemplate = isTemplate;
    }

    await program.save();

    logger.info({ programId: program._id, updatedFields: Object.keys(req.body) }, 'Програма оновлено');

    res.status(200).json({
      success: true,
      message: 'Програма оновлена успішно',
      data: program,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка оновлення програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * DELETE /api/programs/:id
 * Видалити програму
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkProgramOwner)
 * 2. Видаляємо програму
 * 3. Повертаємо підтвердження
 */
export const deleteProgram = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const program = req.program; // Додано через checkProgramOwner middleware

    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Програма не знайдена',
      });
      return;
    }

    const programId = program._id;

    logger.info({ programId, trainerId: program.trainerId }, 'Видалення програми');

    await Program.deleteOne({ _id: programId });

    res.status(200).json({
      success: true,
      message: 'Програма видалена успішно',
    });
  } catch (error) {
    logger.error({ error }, 'Помилка видалення програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/programs/:id/clone
 * Клонувати програму
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkProgramOwner)
 * 2. Створюємо копію програми з новим ID
 * 3. Клонована програма не є шаблоном (isTemplate = false)
 * 4. Повертаємо клоновану програму
 */
export const cloneProgram = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const program = req.program; // Додано через checkProgramOwner middleware
    const trainerId = req.user?.id;

    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Програма не знайдена',
      });
      return;
    }

    if (!trainerId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    // Створюємо копію програми
    const clonedProgram = await Program.create({
      trainerId: new mongoose.Types.ObjectId(trainerId),
      title: `${program.title} (копія)`,
      description: program.description,
      exercises: program.exercises,
      isTemplate: false, // Клонована програма не є шаблоном
    });

    logger.info({ originalProgramId: program._id, clonedProgramId: clonedProgram._id }, 'Програму клоновано');

    res.status(201).json({
      success: true,
      message: 'Програму клоновано успішно',
      data: clonedProgram,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка клонування програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

