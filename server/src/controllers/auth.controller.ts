import { Request, Response } from 'express';
import { User, RefreshToken } from '@/models';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '@/utils/jwt.util';
import { hashPassword, comparePassword } from '@/utils/password.util';
import { generateAndSendCode, verifyCode as verifySmsCode } from '@/services/sms.service';
import { logger } from '@/config/logger';
import { getPhoneSearchVariants } from '@/utils/phone.util';
import type {
  RegisterInput,
  VerifyCodeInput,
  CreatePasswordInput,
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
  ForgotPasswordInput,
} from '@/utils/validators';

/**
 * POST /api/auth/register
 * Реєстрація користувача (крок 1: відправка номера телефону)
 *
 * Процес:
 * 1. Валідація номера телефону (вже зроблено через middleware)
 * 2. Перевірка, чи користувач вже існує
 * 3. Генерація та відправка SMS коду
 * 4. Зберігання коду в БД з TTL
 */
export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
): Promise<void> => {
  try {
    const { phone } = req.body;

    // Перевірка, чи користувач вже існує (з урахуванням різних форматів)
    const phoneVariants = getPhoneSearchVariants(phone);
    let existingUser = null;
    
    for (const variant of phoneVariants) {
      existingUser = await User.findOne({ phone: variant });
      if (existingUser) {
        break;
      }
    }
    
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Користувач з таким номером телефону вже існує',
      });
      return;
    }

    // Генерація та відправка SMS коду
    const result = await generateAndSendCode(phone);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }

    // Відповідь (в development режимі може містити код для тестування)
    res.status(200).json({
      success: true,
      message: result.message,
      ...(result.code && { code: result.code }), // Тільки в development
    });
  } catch (error) {
    logger.error({ error }, 'Помилка реєстрації');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/auth/verify-code
 * Верифікація SMS коду (крок 2: підтвердження коду)
 *
 * Процес:
 * 1. Валідація коду (вже зроблено через middleware)
 * 2. Перевірка коду в БД
 * 3. Встановлення isVerified = true (якщо користувач існує) або створення тимчасового запису
 */
export const verifyCode = async (
  req: Request<{}, {}, VerifyCodeInput>,
  res: Response
): Promise<void> => {
  try {
    const { phone, code } = req.body;

    // Валідація коду
    const verificationResult = await verifySmsCode(phone, code);

    if (!verificationResult.valid) {
      res.status(400).json({
        success: false,
        message: verificationResult.reason || 'Невірний код верифікації',
      });
      return;
    }

    // Перевірка, чи користувач існує (з урахуванням різних форматів)
    const phoneVariants = getPhoneSearchVariants(phone);
    let user = null;
    
    for (const variant of phoneVariants) {
      user = await User.findOne({ phone: variant });
      if (user) {
        // Використовуємо знайдений номер для консистентності
        if (user.phone !== phone) {
          logger.info(
            { requestedPhone: phone, foundPhone: user.phone },
            '📞 Знайдено користувача з альтернативним форматом номера'
          );
        }
        break;
      }
    }

    if (user) {
      // Якщо користувач існує - оновлюємо isVerified
      user.isVerified = true;
      await user.save();
    } else {
      // Якщо користувача немає - створюємо тимчасовий запис без пароля
      // Пароль буде встановлено в наступному кроці (create-password)
      user = new User({
        phone, // Використовуємо нормалізований номер з middleware
        isVerified: true,
        // password буде встановлено в create-password
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Код верифікації підтверджено',
      verified: true,
    });
  } catch (error) {
    logger.error({ error }, 'Помилка верифікації коду');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/auth/create-password
 * Створення паролю (крок 3: після верифікації)
 *
 * Процес:
 * 1. Валідація паролю (вже зроблено через middleware)
 * 2. Перевірка, що користувач верифікований
 * 3. Хешування паролю
 * 4. Збереження користувача (або оновлення паролю)
 * 5. Генерація access + refresh токенів
 * 6. Збереження refresh токену в БД
 */
export const createPassword = async (
  req: Request<{}, {}, CreatePasswordInput>,
  res: Response
): Promise<void> => {
  try {
    const {
      phone,
      password,
      name,
      surname,
      email,
      birthday,
      experience,
      city,
    } = req.body;

    // Пошук користувача (з урахуванням різних форматів)
    const phoneVariants = getPhoneSearchVariants(phone);
    let user = null;
    
    for (const variant of phoneVariants) {
      user = await User.findOne({ phone: variant });
      if (user) {
        break;
      }
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувач не знайдений. Спочатку верифікуйте номер телефону.',
      });
      return;
    }

    // Перевірка, що користувач верифікований
    if (!user.isVerified) {
      res.status(400).json({
        success: false,
        message: 'Номер телефону не верифіковано. Спочатку верифікуйте номер.',
      });
      return;
    }

    // Перевірка, що пароль надано
    if (!password || password.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Пароль обов\'язковий',
      });
      return;
    }

    // Перевіряємо, чи це відновлення паролю (у користувача вже був пароль)
    const isPasswordReset = !!user.password;

    // Хешування паролю
    const hashedPassword = await hashPassword(password);

    // Якщо це відновлення паролю - інвалідуємо всі старі токени
    if (isPasswordReset) {
      await RefreshToken.deleteMany({ userId: user._id });
      logger.info(
        { userId: user._id.toString(), phone: user.phone },
        '🔒 Інвалідація всіх токенів після зміни паролю'
      );
    }

    // Оновлення користувача
    user.password = hashedPassword;
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (birthday) user.birthday = birthday;
    if (experience) user.experience = experience;
    if (city) user.city = city;

    await user.save();

    // Генерація токенів
    const accessToken = generateAccessToken(
      user._id.toString(),
      user.phone,
      user.isVerified
    );
    const refreshToken = generateRefreshToken(user._id.toString());

    // Збереження refresh токену в БД
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 днів

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });

    // Відповідь з токенами та інформацією про користувача
    res.status(201).json({
      success: true,
      message: 'Пароль створено успішно',
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        surname: user.surname,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка створення паролю');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/auth/login
 * Вхід в систему
 *
 * Процес:
 * 1. Валідація телефону та паролю (вже зроблено через middleware)
 * 2. Пошук користувача
 * 3. Перевірка паролю
 * 4. Генерація access + refresh токенів
 * 5. Збереження refresh токену в БД
 */
export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
): Promise<void> => {
  try {
    const { phone, password } = req.body;

    // Пошук користувача з паролем (з урахуванням різних форматів)
    const phoneVariants = getPhoneSearchVariants(phone);
    let user = null;
    
    for (const variant of phoneVariants) {
      user = await User.findOne({ phone: variant }).select('+password');
      if (user) {
        break;
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Невірний номер телефону або пароль',
      });
      return;
    }

    // Перевірка, чи у користувача встановлений пароль
    if (!user.password) {
      res.status(400).json({
        success: false,
        message: 'Пароль не встановлено. Спочатку створіть пароль через реєстрацію.',
      });
      return;
    }

    // Перевірка паролю
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Невірний номер телефону або пароль',
      });
      return;
    }

    // Генерація токенів
    const accessToken = generateAccessToken(
      user._id.toString(),
      user.phone,
      user.isVerified
    );
    const refreshToken = generateRefreshToken(user._id.toString());

    // Збереження refresh токену в БД
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 днів

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });

    // Відповідь з токенами та інформацією про користувача
    res.status(200).json({
      success: true,
      message: 'Вхід виконано успішно',
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        surname: user.surname,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка входу');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/auth/refresh-token
 * Оновлення access токену
 *
 * Процес:
 * 1. Валідація refresh токену (вже зроблено через middleware)
 * 2. Перевірка наявності токену в БД
 * 3. Перевірка терміну дії
 * 4. Генерація нових токенів
 * 5. Оновлення refresh токену в БД
 */
export const refreshToken = async (
  req: Request<{}, {}, RefreshTokenInput>,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    // Валідація токену
    const verificationResult = verifyToken(token);

    if (!verificationResult.valid || !verificationResult.payload) {
      res.status(401).json({
        success: false,
        message: verificationResult.error || 'Невірний або прострочений refresh токен',
      });
      return;
    }

    const { userId } = verificationResult.payload as { userId: string; type?: string };

    // Перевірка наявності токену в БД
    const refreshTokenDoc = await RefreshToken.findOne({
      userId,
      token,
    });

    if (!refreshTokenDoc) {
      res.status(401).json({
        success: false,
        message: 'Refresh токен не знайдено або вже використано',
      });
      return;
    }

    // Перевірка терміну дії
    if (refreshTokenDoc.expiresAt < new Date()) {
      // Видаляємо прострочений токен
      await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
      res.status(401).json({
        success: false,
        message: 'Refresh токен прострочений',
      });
      return;
    }

    // Пошук користувача
    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Користувач не знайдений',
      });
      return;
    }

    // Генерація нових токенів
    const newAccessToken = generateAccessToken(
      user._id.toString(),
      user.phone,
      user.isVerified
    );
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Оновлення refresh токену в БД
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 днів

    // Видаляємо старий токен
    await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });

    // Створюємо новий токен
    await RefreshToken.create({
      userId: user._id,
      token: newRefreshToken,
      expiresAt,
    });

    // Відповідь з новими токенами
    res.status(200).json({
      success: true,
      message: 'Токени оновлено успішно',
      tokens: {
        access: newAccessToken,
        refresh: newRefreshToken,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Помилка оновлення токену');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/auth/logout
 * Вихід з системи
 *
 * Процес:
 * 1. Валідація refresh токену (вже зроблено через middleware)
 * 2. Видалення refresh токену з БД
 */
export const logout = async (
  req: Request<{}, {}, LogoutInput>,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    // Видалення refresh токену з БД
    const result = await RefreshToken.deleteOne({ token });

    if (result.deletedCount === 0) {
      // Токен не знайдено (можливо вже видалено)
      res.status(200).json({
        success: true,
        message: 'Вихід виконано',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Вихід виконано успішно',
    });
  } catch (error) {
    logger.error({ error }, 'Помилка виходу');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

/**
 * POST /api/auth/forgot-password
 * Відновлення паролю (крок 1: відправка номера телефону)
 *
 * Процес:
 * 1. Валідація номера телефону (вже зроблено через middleware)
 * 2. Перевірка, чи користувач існує
 * 3. Якщо користувач існує - генерація та відправка SMS коду
 * 4. Якщо користувача немає - повертаємо помилку (безпека)
 */
export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
): Promise<void> => {
  try {
    const { phone } = req.body;

    logger.info({ phone }, '🔐 Запит на відновлення паролю');

    // Перевірка, чи користувач існує
    // Використовуємо нормалізований номер (вже нормалізований через middleware)
    // Важливо: використовуємо .select('+password') щоб завантажити пароль (який за замовчуванням прихований)
    let user = await User.findOne({ phone }).select('+password');

    // Якщо не знайдено, спробуємо знайти з різними варіантами формату
    if (!user) {
      const phoneVariants = getPhoneSearchVariants(phone);
      
      for (const variant of phoneVariants) {
        user = await User.findOne({ phone: variant }).select('+password');
        if (user) {
          logger.info(
            { originalPhone: phone, foundWithVariant: variant },
            '✅ Користувач знайдений з альтернативним форматом номера'
          );
          break;
        }
      }

      // Логування для діагностики
      if (!user) {
        logger.warn(
          {
            phone,
            phoneVariants,
            // Перевірка в БД - які номери там є
            sampleUsers: await User.find({}).limit(3).select('phone').lean(),
          },
          '⚠️ Спроба відновлення паролю для неіснуючого користувача'
        );
      }
    }

    if (!user) {
      // Повертаємо помилку, якщо користувача не існує
      res.status(404).json({
        success: false,
        message: 'Користувача з таким номером телефону не знайдено. Перевірте правильність введення номера.',
      });
      return;
    }

    // Перевірка, чи у користувача є пароль (не новий користувач)
    if (!user.password) {
      res.status(400).json({
        success: false,
        message: 'Для цього акаунта пароль ще не встановлено. Використайте реєстрацію.',
      });
      return;
    }

    // Генерація та відправка SMS коду
    logger.info({ phone }, '📤 Генерація SMS коду для відновлення паролю');
    const result = await generateAndSendCode(phone);

    if (!result.success) {
      logger.error({ phone, reason: result.message }, '❌ Помилка генерації коду');
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }

    logger.info({ phone, code: result.code }, '✅ SMS код згенеровано та відправлено');

    // Відповідь (в development режимі може містити код для тестування)
    res.status(200).json({
      success: true,
      message: 'Код верифікації відправлено на ваш номер телефону',
      ...(result.code && { code: result.code }), // Тільки в development
    });
  } catch (error) {
    logger.error({ error }, 'Помилка відновлення паролю');
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

