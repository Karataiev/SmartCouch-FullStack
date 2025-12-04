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
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val || val === '') return undefined;
      
      const trimmed = val.trim();
      if (!trimmed) return undefined;

      // Функція для парсингу різних форматів дат
      const parseDate = (dateString: string): Date | null => {
        // Спроба парсингу різних форматів
        const formats = [
          // dd.MM.yyyy
          /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
          // dd.MM.yy
          /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/,
          // dd/MM/yyyy
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
          // dd/MM/yy
          /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
          // dd-MM-yyyy
          /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
          // dd-MM-yy
          /^(\d{1,2})-(\d{1,2})-(\d{2})$/,
        ];

        for (const format of formats) {
          const match = dateString.match(format);
          if (match) {
            let day = parseInt(match[1], 10);
            let month = parseInt(match[2], 10);
            let year = parseInt(match[3], 10);

            // Якщо рік у форматі yy, конвертуємо в yyyy
            if (year < 100) {
              // Якщо yy < 50, вважаємо 20yy, інакше 19yy
              year = year < 50 ? 2000 + year : 1900 + year;
            }

            // Валідація днів та місяців
            if (day < 1 || day > 31 || month < 1 || month > 12) {
              continue;
            }

            // Створюємо дату та перевіряємо валідність
            const date = new Date(year, month - 1, day);
            if (
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            ) {
              return date;
            }
          }
        }

        // Якщо не знайдено жодного формату, спробуємо стандартний парсинг Date
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
          return date;
        }

        return null;
      };

      const parsedDate = parseDate(trimmed);
      
      if (!parsedDate) {
        throw new Error('Невірний формат дати. Використовуйте формат dd.MM.yyyy, dd.MM.yy або ISO 8601');
      }

      // Перевірка, що дата не в майбутньому
      if (parsedDate > new Date()) {
        throw new Error('Дата народження не може бути в майбутньому');
      }

      return parsedDate;
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

/**
 * Схема для оновлення профілю користувача
 * PUT /api/user/profile
 */
export const updateProfileSchema = z.object({
  name: z.string().max(50, 'Ім\'я не може бути довше 50 символів').trim().optional().or(z.literal('')),
  surname: z.string().max(50, 'Прізвище не може бути довше 50 символів').trim().optional().or(z.literal('')),
  email: z
    .string()
    .email('Невірний формат email')
    .max(100, 'Email не може бути довше 100 символів')
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal('')),
  birthday: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val || val === '') return undefined;
      
      const trimmed = val.trim();
      if (!trimmed) return undefined;

      // Функція для парсингу різних форматів дат
      const parseDate = (dateString: string): Date | null => {
        // Спроба парсингу різних форматів
        const formats = [
          // dd.MM.yyyy
          /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
          // dd.MM.yy
          /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/,
          // dd/MM/yyyy
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
          // dd/MM/yy
          /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
          // dd-MM-yyyy
          /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
          // dd-MM-yy
          /^(\d{1,2})-(\d{1,2})-(\d{2})$/,
        ];

        for (const format of formats) {
          const match = dateString.match(format);
          if (match) {
            let day = parseInt(match[1], 10);
            let month = parseInt(match[2], 10);
            let year = parseInt(match[3], 10);

            // Якщо рік у форматі yy, конвертуємо в yyyy
            if (year < 100) {
              // Якщо yy < 50, вважаємо 20yy, інакше 19yy
              year = year < 50 ? 2000 + year : 1900 + year;
            }

            // Валідація днів та місяців
            if (day < 1 || day > 31 || month < 1 || month > 12) {
              continue;
            }

            // Створюємо дату та перевіряємо валідність
            const date = new Date(year, month - 1, day);
            if (
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            ) {
              return date;
            }
          }
        }

        // Якщо не знайдено жодного формату, спробуємо стандартний парсинг Date
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
          return date;
        }

        return null;
      };

      const parsedDate = parseDate(trimmed);
      
      if (!parsedDate) {
        throw new Error('Невірний формат дати. Використовуйте формат dd.MM.yyyy, dd.MM.yy або ISO 8601');
      }

      // Перевірка, що дата не в майбутньому
      if (parsedDate > new Date()) {
        throw new Error('Дата народження не може бути в майбутньому');
      }

      return parsedDate;
    }),
  experience: z.string().max(200, 'Досвід не може бути довше 200 символів').trim().optional().or(z.literal('')),
  city: z.string().max(100, 'Місто не може бути довше 100 символів').trim().optional().or(z.literal('')),
  avatar: z
    .string()
    .url('Невірний формат URL для аватара')
    .max(500, 'URL аватара не може бути довше 500 символів')
    .trim()
    .optional()
    .or(z.literal('')),
});

/**
 * Схема для connection method (спосіб зв'язку)
 */
const connectionMethodSchema = z.object({
  type: z.string().min(1, 'Тип способу зв\'язку обов\'язковий').trim(),
  link: z.string().min(1, 'Посилання обов\'язкове').trim(),
  icon: z.string().trim().optional(),
});

/**
 * Схема для створення клієнта
 * POST /api/clients
 */
export const createClientSchema = z.object({
  name: z.string().min(1, 'Ім\'я обов\'язкове').max(50, 'Ім\'я не може бути довше 50 символів').trim(),
  surname: z.string().min(1, 'Прізвище обов\'язкове').max(50, 'Прізвище не може бути довше 50 символів').trim(),
  phone: phoneSchema,
  connectionMethods: z.array(connectionMethodSchema).default([]).optional(),
  targetAndWishes: z.string().max(500, 'Цілі та побажання не можуть бути довше 500 символів').trim().optional().or(z.literal('')),
  stateOfHealth: z.string().max(500, 'Стан здоров\'я не може бути довше 500 символів').trim().optional().or(z.literal('')),
  levelOfPhysical: z.string().max(200, 'Рівень фізичної підготовки не може бути довше 200 символів').trim().optional().or(z.literal('')),
  notes: z.string().max(1000, 'Замітки не можуть бути довше 1000 символів').trim().optional().or(z.literal('')),
});

/**
 * Схема для оновлення клієнта
 * PUT /api/clients/:id
 */
export const updateClientSchema = z.object({
  name: z.string().max(50, 'Ім\'я не може бути довше 50 символів').trim().optional().or(z.literal('')),
  surname: z.string().max(50, 'Прізвище не може бути довше 50 символів').trim().optional().or(z.literal('')),
  phone: phoneSchema.optional(),
  connectionMethods: z.array(connectionMethodSchema).optional(),
  targetAndWishes: z.string().max(500, 'Цілі та побажання не можуть бути довше 500 символів').trim().optional().or(z.literal('')),
  stateOfHealth: z.string().max(500, 'Стан здоров\'я не може бути довше 500 символів').trim().optional().or(z.literal('')),
  levelOfPhysical: z.string().max(200, 'Рівень фізичної підготовки не може бути довше 200 символів').trim().optional().or(z.literal('')),
  notes: z.string().max(1000, 'Замітки не можуть бути довше 1000 символів').trim().optional().or(z.literal('')),
});

/**
 * Схема для оновлення параметрів клієнта
 * PUT /api/clients/:id/parameters
 */
export const updateClientParametersSchema = z.object({
  parameters: z.array(z.any()), // Будь-які об'єкти в масиві
});

/**
 * Схема для призначення програми клієнту
 * PUT /api/clients/:id/program
 */
export const assignProgramSchema = z.object({
  programId: z.string().min(1, 'ID програми обов\'язковий').optional().or(z.literal('')),
  title: z.string().trim().optional().or(z.literal('')),
  program: z.any().optional(), // Будь-яка структура програми
});

/**
 * Схема для training date (дата та час тренування)
 * Може бути об'єктом з date та time, або просто датою
 */
const trainingDateSchema = z.union([
  z.object({
    date: z.string().min(1, 'Дата обов\'язкова'),
    time: z.array(z.string()).length(2, 'Має бути два значення часу (початок та кінець)'),
  }),
  z.string().datetime('Невірний формат дати'),
  z.date(),
  z.any(), // Дозволяємо будь-яку структуру для гнучкості
]);

/**
 * Схема для occurrence (окреме тренування)
 */
const occurrenceSchema = z.object({
  id: z.string().min(1, 'ID occurrence обов\'язковий'),
  slotId: z.string().min(1, 'Slot ID обов\'язковий'),
  trainingDate: trainingDateSchema,
});

/**
 * Схема для створення плану тренування
 * POST /api/workout-plans
 */
export const createWorkoutPlanSchema = z.object({
  clientId: z
    .union([
      z.string().min(1).refine((val) => {
        // Перевірка, що це валідний ObjectId
        return /^[0-9a-fA-F]{24}$/.test(val);
      }, 'Невірний формат ID клієнта'),
      z.literal(''),
      z.undefined(),
    ])
    .optional(),
  trainingName: z
    .string()
    .min(1, 'Назва тренування обов\'язкова')
    .max(200, 'Назва тренування не може бути довше 200 символів')
    .trim()
    .default('Gym'),
  trainingType: z
    .string()
    .max(100, 'Тип тренування не може бути довше 100 символів')
    .trim()
    .default('personal')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(200, 'Місце проведення не може бути довше 200 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  trainingDate: z
    .array(trainingDateSchema)
    .min(1, 'Має бути принаймні одна дата тренування'),
  occurrences: z.array(occurrenceSchema).optional().default([]),
});

/**
 * Схема для оновлення плану тренування
 * PUT /api/workout-plans/:id
 */
export const updateWorkoutPlanSchema = z.object({
  trainingName: z
    .string()
    .max(200, 'Назва тренування не може бути довше 200 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  trainingType: z
    .string()
    .max(100, 'Тип тренування не може бути довше 100 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(200, 'Місце проведення не може бути довше 200 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  trainingDate: z.array(trainingDateSchema).optional(),
  occurrences: z.array(occurrenceSchema).optional(),
});

/**
 * Схема для видалення окремого тренування (occurrence)
 * DELETE /api/workout-plans/:id/occurrence
 */
export const deleteOccurrenceSchema = z.object({
  occurrenceId: z.string().min(1, 'ID occurrence обов\'язковий'),
  date: z.string().min(1, 'Дата обов\'язкова').optional(), // Дата для видалення конкретного occurrence
});

/**
 * Схема для створення програми тренування
 * POST /api/programs
 */
export const createProgramSchema = z.object({
  title: z
    .string()
    .min(1, 'Назва програми обов\'язкова')
    .max(200, 'Назва програми не може бути довше 200 символів')
    .trim(),
  description: z
    .string()
    .max(2000, 'Опис програми не може бути довше 2000 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  exercises: z.array(z.any()).default([]).optional(), // Масив вправ (будь-яка структура)
  isTemplate: z.boolean().default(false).optional(), // Чи є програма шаблоном
});

/**
 * Схема для оновлення програми тренування
 * PUT /api/programs/:id
 */
export const updateProgramSchema = z.object({
  title: z
    .string()
    .max(200, 'Назва програми не може бути довше 200 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'Опис програми не може бути довше 2000 символів')
    .trim()
    .optional()
    .or(z.literal('')),
  exercises: z.array(z.any()).optional(), // Масив вправ (будь-яка структура)
  isTemplate: z.boolean().optional(), // Чи є програма шаблоном
});

// Експорт типів для використання в контролерах
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type UpdateClientParametersInput = z.infer<typeof updateClientParametersSchema>;
export type AssignProgramInput = z.infer<typeof assignProgramSchema>;
export type CreateWorkoutPlanInput = z.infer<typeof createWorkoutPlanSchema>;
export type UpdateWorkoutPlanInput = z.infer<typeof updateWorkoutPlanSchema>;
export type DeleteOccurrenceInput = z.infer<typeof deleteOccurrenceSchema>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

