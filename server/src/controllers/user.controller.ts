import { Request, Response } from 'express';
import { User, RefreshToken } from '@/models';
import { logger } from '@/config/logger';
import type { UpdateProfileInput } from '@/utils/validators';

/**
 * GET /api/user/profile
 * Отримати профіль поточного користувача
 *
 * Процес:
 * 1. Отримуємо userId з req.user (додано через authenticate middleware)
 * 2. Знаходимо користувача в БД
 * 3. Повертаємо дані профілю (без пароля)
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    // Пошук користувача
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувач не знайдений',
      });
      return;
    }

    // Відповідь з даними профілю
    res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        surname: user.surname,
        email: user.email,
        birthday: user.birthday,
        experience: user.experience,
        city: user.city,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка отримання профілю');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * PUT /api/user/profile
 * Оновити профіль поточного користувача
 *
 * Процес:
 * 1. Отримуємо userId з req.user
 * 2. Валідація даних (вже зроблено через middleware)
 * 3. Оновлюємо дані користувача
 * 4. Повертаємо оновлений профіль
 */
export const updateProfile = async (
  req: Request<{}, {}, UpdateProfileInput>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    const { name, surname, email, birthday, experience, city, avatar } = req.body;

    // Пошук користувача
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувач не знайдений',
      });
      return;
    }

    // Оновлення полів (тільки якщо вони надані)
    // Якщо передано порожній рядок - очищаємо поле
    if (name !== undefined) {
      user.name = name === '' ? undefined : name;
    }
    if (surname !== undefined) {
      user.surname = surname === '' ? undefined : surname;
    }
    if (email !== undefined) {
      user.email = email === '' ? undefined : email;
    }
    if (birthday !== undefined) {
      user.birthday = birthday || undefined;
    }
    if (experience !== undefined) {
      user.experience = experience === '' ? undefined : experience;
    }
    if (city !== undefined) {
      user.city = city === '' ? undefined : city;
    }
    if (avatar !== undefined) {
      user.avatar = avatar === '' ? undefined : avatar;
    }

    // Збереження оновленого користувача
    await user.save();

    logger.info({ userId, updatedFields: Object.keys(req.body) }, 'Профіль користувача оновлено');

    // Відповідь з оновленими даними
    res.status(200).json({
      success: true,
      message: 'Профіль оновлено успішно',
      data: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        surname: user.surname,
        email: user.email,
        birthday: user.birthday,
        experience: user.experience,
        city: user.city,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка оновлення профілю');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * DELETE /api/user/account
 * Видалити акаунт поточного користувача
 *
 * Процес:
 * 1. Отримуємо userId з req.user
 * 2. Видаляємо всі refresh токени користувача
 * 3. Видаляємо користувача з БД
 * 4. Повертаємо підтвердження
 *
 * УВАГА: Ця операція незворотна!
 */
export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Користувач не авторизований',
      });
      return;
    }

    // Перевірка, чи користувач існує
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувач не знайдений',
      });
      return;
    }

    // Видалення всіх refresh токенів користувача
    await RefreshToken.deleteMany({ userId: user._id });

    logger.info({ userId, phone: user.phone }, 'Видалення акаунта користувача');

    // Видалення користувача
    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      success: true,
      message: 'Акаунт успішно видалено',
    });
  } catch (error) {
    logger.error({ error }, 'Помилка видалення акаунта');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

