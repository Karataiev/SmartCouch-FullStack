import { z } from 'zod';
import dotenv from 'dotenv';

// Завантажуємо змінні оточення
dotenv.config();

// Схема валідації env змінних
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(3000),
  MONGODB_URI: z.string().url().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET має бути мінімум 32 символи'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SMS_PROVIDER: z.string().default('twilio'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(900000),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(100),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

// Валідація та типізація
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(
        `❌ Помилка валідації env змінних:\n${missingVars.join('\n')}\n\nПеревірте .env файл`
      );
    }
    throw error;
  }
};

// Експортуємо типізовану конфігурацію
export const env = parseEnv();

// Тип для використання в інших місцях
export type EnvConfig = typeof env;
