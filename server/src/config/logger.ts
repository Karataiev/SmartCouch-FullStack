import pino from 'pino';
import { env } from './env';

// Налаштування Pino logger
const loggerConfig: pino.LoggerOptions = {
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
};

// Створюємо та експортуємо logger
export const logger = pino(loggerConfig);
