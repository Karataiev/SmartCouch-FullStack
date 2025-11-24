import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Інтерфейс для документа VerificationCode в MongoDB
 * Описує структуру кодів верифікації для SMS
 */
export interface IVerificationCode extends Document {
  phone: string;
  code: string;
  attempts: number; // Кількість спроб введення коду
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Інтерфейс для статичних методів моделі
 */
export interface IVerificationCodeModel extends Model<IVerificationCode> {
  // Тут можна додати статичні методи, наприклад:
  // findByPhone(phone: string): Promise<IVerificationCode | null>;
  // deleteExpiredCodes(): Promise<number>;
}

/**
 * Схема Mongoose для кодів верифікації
 * Визначає структуру, валідацію, індекси та TTL
 */
const verificationCodeSchema = new Schema<IVerificationCode>(
  {
    phone: {
      type: String,
      required: [true, 'Номер телефону обов\'язковий'],
      index: true, // Індекс для швидкого пошуку
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Невірний формат номера телефону'],
    },
    code: {
      type: String,
      required: [true, 'Код обов\'язковий'],
      trim: true,
      match: [/^\d{6}$/, 'Код має містити 6 цифр'],
    },
    attempts: {
      type: Number,
      default: 0, // Початкова кількість спроб
      min: [0, 'Кількість спроб не може бути від\'ємною'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'expiresAt обов\'язковий'],
      index: { expireAfterSeconds: 0 }, // TTL індекс - автоматично видаляє документи після expiresAt
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Тільки createdAt
    collection: 'verificationcodes', // Явно вказуємо назву колекції
  }
);

// Складений індекс для пошуку за телефоном та кодом
verificationCodeSchema.index({ phone: 1, code: 1 });

// Індекс для пошуку за терміном дії (для очищення прострочених кодів)
verificationCodeSchema.index({ expiresAt: 1 });

// Експорт моделі
// Перевіряємо, чи модель вже існує (для hot reload в development)
export const VerificationCode: IVerificationCodeModel =
  (mongoose.models.VerificationCode as IVerificationCodeModel) ||
  mongoose.model<IVerificationCode, IVerificationCodeModel>(
    'VerificationCode',
    verificationCodeSchema
  );

