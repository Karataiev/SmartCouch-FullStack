import express, { Express } from 'express';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';
import {
  corsMiddleware,
  rateLimiter,
  helmetMiddleware,
  bodySizeLimiter,
} from './middleware/security.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { authRoutes } from './routes';

// Створюємо Express app
const app: Express = express();

// Middleware для безпеки (застосовуємо до всіх роутів)
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(bodySizeLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/clients', clientsRoutes);
// app.use('/api/v1/programs', programsRoutes);
// app.use('/api/v1/workout-plans', workoutPlansRoutes);

// Обробка 404
app.use(notFoundHandler);

// Обробка помилок (має бути останнім)
app.use(errorHandler);

/**
 * Запуск сервера
 */
const startServer = async () => {
  try {
    // Підключення до БД
    await connectDatabase();

    // Запуск сервера
    app.listen(env.PORT, () => {
      logger.info(`🚀 Сервер запущено на порту ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error({ error }, '❌ Помилка запуску сервера');
    process.exit(1);
  }
};

// Запускаємо сервер
startServer();

export default app;
