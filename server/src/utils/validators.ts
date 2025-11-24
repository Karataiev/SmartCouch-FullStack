import { z } from 'zod';

/**
 * Валідація та нормалізація номера телефону
 * Формат: E.164 (наприклад, +380501234567)
 */
const phoneSchema = z
  .string()
  .min(1, 'Номер телефону обов\'язковий')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Невірний формат номера телефону')
  .transform((val) => {
    // Нормалізація: видалення пробілів та дефісів
    const normalized = val.replace(/[\s-]/g, '');
    // Якщо немає + на початку, додаємо (для українських номерів)
    // Але краще залишити як є, щоб не псувати інші формати
    return normalized;
  });

/**
 * Схема для реєстрації (крок 1: відправка номера телефону)
 * POST /api/auth/register
 */
export const registerSchema = z.object({
  phone: phoneSchema,
});

/**
 * Схема для верифікації SMS коду
 * POST /api/auth/verify-code
 */
export const verifyCodeSchema = z.object({
  phone: phoneSchema,
  code: z
    .string()
    .min(1, 'Код верифікації обов\'язковий')
    .regex(/^\d{6}$/, 'Код має містити рівно 6 цифр')
    .transform((val) => val.trim()), // Видалення пробілів
});

/**
 * Схема для створення паролю (після верифікації)
 * POST /api/auth/create-password
 */
export const createPasswordSchema = z.object({
  phone: phoneSchema,
  password: z
    .string()
    .min(8, 'Пароль має бути мінімум 8 символів')
    .max(128, 'Пароль не може бути довше 128 символів')
    .regex(/[A-ZА-ЯІЇЄ]/, 'Пароль має містити хоча б одну велику літеру')
    .regex(/[a-zа-яіїє]/, 'Пароль має містити хоча б одну малу літеру')
    .regex(/\d/, 'Пароль має містити хоча б одну цифру'),
  // Опціональні поля для профілю
  name: z.string().max(50, 'Ім\'я не може бути довше 50 символів').optional(),
  surname: z.string().max(50, 'Прізвище не може бути довше 50 символів').optional(),
  email: z
    .string()
    .email('Невірний формат email')
    .max(100, 'Email не може бути довше 100 символів')
    .optional()
    .or(z.literal('')), // Дозволяємо порожній рядок
  birthday: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val || val === '') return undefined;
      return new Date(val);
    }),
  experience: z.string().max(200, 'Досвід не може бути довше 200 символів').optional(),
  city: z.string().max(100, 'Місто не може бути довше 100 символів').optional(),
});

/**
 * Схема для входу (логін)
 * POST /api/auth/login
 */
export const loginSchema = z.object({
  phone: phoneSchema,
  password: z
    .string()
    .min(1, 'Пароль обов\'язковий')
    .min(8, 'Пароль має бути мінімум 8 символів'),
});

/**
 * Схема для оновлення access токену
 * POST /api/auth/refresh-token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh токен обов\'язковий')
    .trim(),
});

/**
 * Схема для виходу (logout)
 * POST /api/auth/logout
 */
export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh токен обов\'язковий')
    .trim(),
});

/**
 * Схема для відновлення паролю (крок 1: відправка номера телефону)
 * POST /api/auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
});

// Експорт типів для використання в контролерах
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

