import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Інтерфейс для документа Program в MongoDB
 */
export interface IProgram extends Document {
  trainerId: mongoose.Types.ObjectId; // Reference to User (тренер)
  title: string; // Назва програми
  description?: string; // Опис програми
  exercises: any[]; // Масив вправ (будь-яка структура)
  isTemplate: boolean; // Чи є програма шаблоном
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Інтерфейс для статичних методів моделі
 */
export interface IProgramModel extends Model<IProgram> {
  // Тут можна додати статичні методи, якщо потрібно
}

/**
 * Схема Mongoose для програми тренування
 */
const programSchema = new Schema<IProgram>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID тренера обов\'язковий'],
      index: true, // Індекс для швидкого пошуку програм тренера
    },
    title: {
      type: String,
      required: [true, 'Назва програми обов\'язкова'],
      trim: true,
      maxlength: [200, 'Назва програми не може бути довше 200 символів'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Опис програми не може бути довше 2000 символів'],
    },
    exercises: {
      type: [Schema.Types.Mixed], // Масив будь-яких об'єктів (вправи)
      default: [],
    },
    isTemplate: {
      type: Boolean,
      default: false, // За замовчуванням не шаблон
      index: true, // Індекс для швидкого пошуку шаблонів
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
    collection: 'programs', // Явно вказуємо назву колекції
  }
);

// Індекси для швидкого пошуку
programSchema.index({ trainerId: 1 }); // Пошук програм тренера
programSchema.index({ trainerId: 1, isTemplate: 1 }); // Складний індекс для пошуку шаблонів тренера
programSchema.index({ isTemplate: 1 }); // Пошук всіх шаблонів (якщо потрібно)

// Експорт моделі
export const Program: IProgramModel =
  (mongoose.models.Program as IProgramModel) ||
  mongoose.model<IProgram, IProgramModel>('Program', programSchema);

