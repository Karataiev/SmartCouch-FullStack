import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User.model';

/**
 * Інтерфейс для документа RefreshToken в MongoDB
 * Описує структуру refresh токенів для оновлення access токенів
 */
export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  createdAt: Date;
}

/**
 * Інтерфейс для статичних методів моделі
 */
export interface IRefreshTokenModel extends Model<IRefreshToken> {
  // Тут можна додати статичні методи, наприклад:
  // findByToken(token: string): Promise<IRefreshToken | null>;
  // deleteExpiredTokens(): Promise<number>;
}

/**
 * Схема Mongoose для refresh токенів
 * Визначає структуру, валідацію, індекси та TTL
 */
const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Посилання на модель User
      required: [true, 'userId обов\'язковий'],
      index: true, // Індекс для швидкого пошуку за користувачем
    },
    token: {
      type: String,
      required: [true, 'Token обов\'язковий'],
      unique: true, // Унікальність токену
      index: true, // Індекс для швидкого пошуку
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'expiresAt обов\'язковий'],
      index: { expireAfterSeconds: 0 }, // TTL індекс - автоматично видаляє документи після expiresAt
    },
    deviceInfo: {
      type: String,
      trim: true,
      maxlength: [500, 'Інформація про пристрій не може бути довше 500 символів'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Тільки createdAt, updatedAt не потрібен
    collection: 'refreshtokens', // Явно вказуємо назву колекції
  }
);

// Додатковий складений індекс для пошуку за користувачем та токеном
refreshTokenSchema.index({ userId: 1, token: 1 });

// Індекс для пошуку за терміном дії (для очищення прострочених токенів)
refreshTokenSchema.index({ expiresAt: 1 });

// Експорт моделі
// Перевіряємо, чи модель вже існує (для hot reload в development)
export const RefreshToken: IRefreshTokenModel =
  (mongoose.models.RefreshToken as IRefreshTokenModel) ||
  mongoose.model<IRefreshToken, IRefreshTokenModel>(
    'RefreshToken',
    refreshTokenSchema
  );

