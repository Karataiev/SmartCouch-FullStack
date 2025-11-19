import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

// Опції підключення
const mongooseOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Підключення до MongoDB
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, mongooseOptions);
    logger.info('✅ Підключено до MongoDB');
  } catch (error) {
    logger.error({ error }, '❌ Помилка підключення до MongoDB');
    throw error;
  }
};

// Обробка подій підключення
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️  MongoDB відключено');
});

mongoose.connection.on('error', (error) => {
  logger.error({ error }, '❌ Помилка MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB з\'єднання закрито через SIGINT');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB з\'єднання закрито через SIGTERM');
  process.exit(0);
});
