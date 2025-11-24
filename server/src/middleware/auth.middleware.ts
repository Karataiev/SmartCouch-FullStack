import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt.util';
import { User } from '@/models';
import { logger } from '@/config/logger';

/**
 * Middleware для аутентифікації користувача
 * Перевіряє JWT токен та додає інформацію про користувача до req.user
 *
 * Як працює:
 * 1. Витягує токен з заголовка Authorization: Bearer <token>
 * 2. Валідує токен через jwt.util
 * 3. Знаходить користувача в БД
 * 4. Додає інформацію про користувача до req.user
 * 5. Якщо помилка - повертає 401 Unauthorized
 *
 * @example
 * router.get('/profile', authenticate, getProfileController);
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Витягування токену з заголовка Authorization
    const authHeader = req.headers.authorization;

    // Перевірка наявності заголовка
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Токен доступу не надано. Додайте заголовок Authorization: Bearer <token>',
      });
      return;
    }

    // Перевірка формату заголовка (Bearer <token>)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        message: 'Невірний формат токену. Використовуйте: Bearer <token>',
      });
      return;
    }

    const token = parts[1];

    // Валідація токену
    const verificationResult = verifyToken(token);

    if (!verificationResult.valid || !verificationResult.payload) {
      res.status(401).json({
        success: false,
        message: verificationResult.error || 'Невірний або прострочений токен',
      });
      return;
    }

    const { userId } = verificationResult.payload;

    // Пошук користувача в БД
    const user = await User.findById(userId).select('-password'); // Не повертаємо пароль

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Користувач не знайдений',
      });
      return;
    }

    // Додавання інформації про користувача до request
    // Типізація вже визначена в types/express.d.ts
    req.user = {
      id: user._id.toString(),
      phone: user.phone,
      isVerified: user.isVerified,
    };

    // Передача обробки далі
    next();
  } catch (error) {
    logger.error({ error }, 'Помилка аутентифікації');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера при аутентифікації',
    });
  }
};

/**
 * Опціональна аутентифікація
 * Додає користувача до req.user якщо токен валідний, але не блокує запит якщо токену немає
 * Використовується для endpoints, які працюють і для авторизованих, і для неавторизованих користувачів
 *
 * @example
 * router.get('/public-content', optionalAuthenticate, getPublicContentController);
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Якщо токену немає - просто продовжуємо
    if (!authHeader) {
      next();
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      // Невірний формат - продовжуємо без аутентифікації
      next();
      return;
    }

    const token = parts[1];
    const verificationResult = verifyToken(token);

    if (!verificationResult.valid || !verificationResult.payload) {
      // Невірний токен - продовжуємо без аутентифікації
      next();
      return;
    }

    const { userId } = verificationResult.payload;
    const user = await User.findById(userId).select('-password');

    if (user) {
      req.user = {
        id: user._id.toString(),
        phone: user.phone,
        isVerified: user.isVerified,
      };
    }

    next();
  } catch (error) {
    // У разі помилки просто продовжуємо без аутентифікації
    logger.warn({ error }, 'Помилка опціональної аутентифікації');
    next();
  }
};

