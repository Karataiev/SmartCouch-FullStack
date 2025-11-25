import { Request, Response } from 'express';
import { Client, WorkoutPlan } from '@/models';
import { logger } from '@/config/logger';
import mongoose from 'mongoose';
import type {
  CreateClientInput,
  UpdateClientInput,
  UpdateClientParametersInput,
  AssignProgramInput,
} from '@/utils/validators';

/**
 * GET /api/clients
 * Отримати список клієнтів поточного тренера
 *
 * Query параметри:
 * - page: номер сторінки (за замовчуванням 1)
 * - limit: кількість на сторінці (за замовчуванням 20)
 * - search: пошук за ім'ям, прізвищем або телефоном
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Застосовуємо фільтри та пагінацію
 * 3. Повертаємо список клієнтів
 */
export const getClients = async (
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

    // Пошук
    const search = (req.query.search as string)?.trim() || '';

    // Побудова запиту
    const query: any = { trainerId: new mongoose.Types.ObjectId(trainerId) };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Виконання запиту
    const [clients, total] = await Promise.all([
      Client.find(query)
        .sort({ createdAt: -1 }) // Найновіші спочатку
        .skip(skip)
        .limit(limit)
        .lean(),
      Client.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        clients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання списку клієнтів');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * GET /api/clients/:id
 * Отримати деталі клієнта
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkClientOwner)
 * 2. Повертаємо дані клієнта
 */
export const getClientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const client = req.client; // Додано через checkClientOwner middleware

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання клієнта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/clients
 * Створити нового клієнта
 *
 * Процес:
 * 1. Отримуємо trainerId з req.user
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Створюємо клієнта
 * 4. Повертаємо створеного клієнта
 */
export const createClient = async (
  req: Request<{}, {}, CreateClientInput>,
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

    const {
      name,
      surname,
      phone,
      connectionMethods = [],
      targetAndWishes,
      stateOfHealth,
      levelOfPhysical,
      notes,
    } = req.body;

    // Створення клієнта
    const client = await Client.create({
      trainerId: new mongoose.Types.ObjectId(trainerId),
      name,
      surname,
      phone,
      connectionMethods,
      targetAndWishes: targetAndWishes || undefined,
      stateOfHealth: stateOfHealth || undefined,
      levelOfPhysical: levelOfPhysical || undefined,
      notes: notes || undefined,
    });

    logger.info({ trainerId, clientId: client._id }, 'Клієнт створено');

    res.status(201).json({
      success: true,
      message: 'Клієнт створено успішно',
      data: client,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка створення клієнта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * PUT /api/clients/:id
 * Оновити клієнта
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkClientOwner)
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Оновлюємо клієнта
 * 4. Повертаємо оновленого клієнта
 */
export const updateClient = async (
  req: Request<{ id: string }, {}, UpdateClientInput>,
  res: Response
): Promise<void> => {
  try {
    const client = req.client; // Додано через checkClientOwner middleware

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    const {
      name,
      surname,
      phone,
      connectionMethods,
      targetAndWishes,
      stateOfHealth,
      levelOfPhysical,
      notes,
    } = req.body;

    // Оновлення полів (тільки якщо вони надані)
    if (name !== undefined && name !== '') {
      client.name = name;
    }
    if (surname !== undefined && surname !== '') {
      client.surname = surname;
    }
    if (phone !== undefined) {
      client.phone = phone;
    }
    if (connectionMethods !== undefined) {
      client.connectionMethods = connectionMethods;
    }
    if (targetAndWishes !== undefined) {
      client.targetAndWishes = targetAndWishes === '' ? undefined : targetAndWishes;
    }
    if (stateOfHealth !== undefined) {
      client.stateOfHealth = stateOfHealth === '' ? undefined : stateOfHealth;
    }
    if (levelOfPhysical !== undefined) {
      client.levelOfPhysical = levelOfPhysical === '' ? undefined : levelOfPhysical;
    }
    if (notes !== undefined) {
      client.notes = notes === '' ? undefined : notes;
    }

    await client.save();

    logger.info({ clientId: client._id, updatedFields: Object.keys(req.body) }, 'Клієнт оновлено');

    res.status(200).json({
      success: true,
      message: 'Клієнт оновлено успішно',
      data: client,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка оновлення клієнта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * DELETE /api/clients/:id
 * Видалити клієнта
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkClientOwner)
 * 2. Видаляємо клієнта
 * 3. Повертаємо підтвердження
 */
export const deleteClient = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const client = req.client; // Додано через checkClientOwner middleware

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    const clientId = client._id;

    logger.info({ clientId, trainerId: client.trainerId }, 'Видалення клієнта');

    await Client.deleteOne({ _id: clientId });

    res.status(200).json({
      success: true,
      message: 'Клієнт видалено успішно',
    });
  } catch (error) {
    logger.error({ error }, 'Помилка видалення клієнта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * PUT /api/clients/:id/parameters
 * Оновити параметри клієнта
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkClientOwner)
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Оновлюємо параметри
 * 4. Повертаємо оновленого клієнта
 */
export const updateParameters = async (
  req: Request<{ id: string }, {}, UpdateClientParametersInput>,
  res: Response
): Promise<void> => {
  try {
    const client = req.client; // Додано через checkClientOwner middleware

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    const { parameters } = req.body;

    client.parameters = parameters;
    await client.save();

    logger.info({ clientId: client._id }, 'Параметри клієнта оновлено');

    res.status(200).json({
      success: true,
      message: 'Параметри оновлено успішно',
      data: client,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка оновлення параметрів');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * PUT /api/clients/:id/program
 * Призначити програму клієнту
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkClientOwner)
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Оновлюємо програму клієнта
 * 4. Повертаємо оновленого клієнта
 */
export const assignProgram = async (
  req: Request<{ id: string }, {}, AssignProgramInput>,
  res: Response
): Promise<void> => {
  try {
    const client = req.client; // Додано через checkClientOwner middleware

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    const { programId, title, program } = req.body;

    // Якщо programId порожній або не надано - очищаємо програму
    if (!programId || programId === '') {
      client.program = undefined;
    } else {
      client.program = {
        id: new mongoose.Types.ObjectId(programId),
        title: title || undefined,
        program: program || undefined,
      };
    }

    await client.save();

    logger.info({ clientId: client._id, programId }, 'Програму призначено клієнту');

    res.status(200).json({
      success: true,
      message: 'Програму призначено успішно',
      data: client,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка призначення програми');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * GET /api/clients/:id/trainings
 * Отримати тренування клієнта
 *
 * Процес:
 * 1. Перевірка власника (через middleware checkClientOwner)
 * 2. Знаходимо всі тренування клієнта (з WorkoutPlan моделі)
 * 3. Повертаємо список тренувань
 *
 * Примітка: Цей endpoint буде повністю реалізований після створення WorkoutPlan моделі
 */
export const getClientTrainings = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const client = req.client; // Додано через checkClientOwner middleware

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Клієнт не знайдений',
      });
      return;
    }

    // Отримуємо всі плани тренувань для клієнта
    const trainings = await WorkoutPlan.find({ clientId: client._id })
      .sort({ createdAt: -1 }) // Найновіші спочатку
      .lean();

    res.status(200).json({
      success: true,
      data: {
        clientId: client._id,
        trainings,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання тренувань клієнта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

