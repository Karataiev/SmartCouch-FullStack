import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * Payload для JWT токенів
 * Містить інформацію про користувача, яка буде зашифрована в токені
 */
export interface JWTPayload {
  userId: string; // ID користувача з MongoDB
  phone: string; // Номер телефону (для швидкого доступу без запиту до БД)
  isVerified: boolean; // Чи верифікований користувач
}

/**
 * Результат валідації токену
 */
export interface TokenVerificationResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

/**
 * Генерація access токену
 * Access токен - короткоживучий токен (15 хвилин) для авторизації запитів
 *
 * @param userId - ID користувача з MongoDB
 * @param phone - Номер телефону користувача
 * @param isVerified - Чи верифікований користувач
 * @returns JWT токен у вигляді рядка
 *
 * @example
 * const token = generateAccessToken('507f1f77bcf86cd799439011', '+380501234567', true);
 */
export const generateAccessToken = (
  userId: string,
  phone: string,
  isVerified: boolean
): string => {
  const payload: JWTPayload = {
    userId,
    phone,
    isVerified,
  };

  // Генерація токену з використанням секретного ключа та терміну дії
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN, // 15m за замовчуванням
    issuer: 'smartcoach-api', // Хто видав токен
    audience: 'smartcoach-client', // Для кого призначений токен
  } as jwt.SignOptions);
};

/**
 * Генерація refresh токену
 * Refresh токен - довгоживучий токен (7 днів) для оновлення access токену
 *
 * @param userId - ID користувача з MongoDB
 * @returns JWT токен у вигляді рядка
 *
 * @example
 * const refreshToken = generateRefreshToken('507f1f77bcf86cd799439011');
 */
export const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId, // Тільки userId для refresh токену
    type: 'refresh', // Тип токену для розрізнення
  };

  // Генерація токену з довшим терміном дії
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN, // 7d за замовчуванням
    issuer: 'smartcoach-api',
    audience: 'smartcoach-client',
  } as jwt.SignOptions);
};

/**
 * Валідація та декодування JWT токену
 * Перевіряє підпис, термін дії та інші параметри токену
 *
 * @param token - JWT токен для валідації
 * @returns Результат валідації з payload або помилкою
 *
 * @example
 * const result = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * if (result.valid) {
 *   console.log(result.payload); // { userId: '...', phone: '...', isVerified: true }
 * }
 */
export const verifyToken = (token: string): TokenVerificationResult => {
  try {
    // Валідація токену: перевірка підпису, терміну дії, issuer, audience
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'smartcoach-api',
      audience: 'smartcoach-client',
    }) as JWTPayload;

    return {
      valid: true,
      payload: decoded,
    };
  } catch (error) {
    // Обробка різних типів помилок
    let errorMessage = 'Невірний токен';

    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Токен прострочений';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Невірний формат токену';
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = 'Токен ще не активний';
    }

    return {
      valid: false,
      error: errorMessage,
    };
  }
};

/**
 * Декодування токену без валідації
 * Використовується для отримання інформації з токену, коли валідація не потрібна
 * УВАГА: Не використовуйте для безпеки! Завжди використовуйте verifyToken для перевірки
 *
 * @param token - JWT токен для декодування
 * @returns Декодований payload або null
 *
 * @example
 * const payload = decodeToken(token);
 * if (payload) {
 *   console.log(payload.userId);
 * }
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    // Декодування без валідації (не перевіряє підпис або термін дії)
    const decoded = jwt.decode(token) as JWTPayload | null;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Отримання терміну дії токену (expiration time)
 * Корисно для відображення користувачу, коли токен закінчиться
 *
 * @param token - JWT токен
 * @returns Дата закінчення терміну дії або null
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // JWT токени містять поле 'exp' (expiration time) в секундах
  // Але decodeToken повертає наш payload, тому потрібно декодувати повний токен
  try {
    const fullDecoded = jwt.decode(token, { complete: true });
    if (fullDecoded && typeof fullDecoded === 'object' && 'exp' in fullDecoded) {
      const exp = (fullDecoded as { exp: number }).exp;
      return new Date(exp * 1000); // Конвертуємо з секунд в мілісекунди
    }
  } catch (error) {
    return null;
  }

  return null;
};

