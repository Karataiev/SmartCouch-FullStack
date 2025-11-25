import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Інтерфейс для occurrence (окреме тренування)
 * Кожне тренування може мати кілька occurrences (для повторюваних тренувань)
 */
export interface IOccurrence {
  id: string; // Унікальний ID occurrence
  slotId: string; // ID слота в календарі (наприклад, "09:00")
  trainingDate: any; // Дата та час тренування (може бути об'єктом з date та time)
}

/**
 * Інтерфейс для документа WorkoutPlan в MongoDB
 */
export interface IWorkoutPlan extends Document {
  trainerId: mongoose.Types.ObjectId; // Reference to User (тренер)
  clientId: mongoose.Types.ObjectId; // Reference to Client
  trainingName: string; // Назва тренування
  trainingType?: string; // Тип тренування
  location?: string; // Місце проведення
  trainingDate: any[]; // Масив дат тренувань (може містити об'єкти з date та time)
  occurrences: IOccurrence[]; // Масив окремих тренувань
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Інтерфейс для статичних методів моделі
 */
export interface IWorkoutPlanModel extends Model<IWorkoutPlan> {
  // Тут можна додати статичні методи, якщо потрібно
}

/**
 * Схема для occurrence
 */
const occurrenceSchema = new Schema<IOccurrence>(
  {
    id: {
      type: String,
      required: [true, 'ID occurrence обов\'язковий'],
      trim: true,
    },
    slotId: {
      type: String,
      required: [true, 'Slot ID обов\'язковий'],
      trim: true,
    },
    trainingDate: {
      type: Schema.Types.Mixed, // Може бути об'єктом з date та time
      required: [true, 'Дата тренування обов\'язкова'],
    },
  },
  {
    _id: false, // Не створюємо окремий _id для піддокумента
  }
);

/**
 * Схема Mongoose для плану тренування
 */
const workoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID тренера обов\'язковий'],
      index: true, // Індекс для швидкого пошуку планів тренера
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'ID клієнта обов\'язковий'],
      index: true, // Індекс для швидкого пошуку планів клієнта
    },
    trainingName: {
      type: String,
      required: [true, 'Назва тренування обов\'язкова'],
      trim: true,
      maxlength: [200, 'Назва тренування не може бути довше 200 символів'],
    },
    trainingType: {
      type: String,
      trim: true,
      maxlength: [100, 'Тип тренування не може бути довше 100 символів'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Місце проведення не може бути довше 200 символів'],
    },
    trainingDate: {
      type: [Schema.Types.Mixed], // Масив об'єктів з датами та часом
      required: [true, 'Дата тренування обов\'язкова'],
      validate: {
        validator: function (dates: any[]) {
          return Array.isArray(dates) && dates.length > 0;
        },
        message: 'Має бути принаймні одна дата тренування',
      },
    },
    occurrences: {
      type: [occurrenceSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
    collection: 'workoutPlans', // Явно вказуємо назву колекції
  }
);

// Індекси для швидкого пошуку
workoutPlanSchema.index({ trainerId: 1 }); // Пошук планів тренера
workoutPlanSchema.index({ clientId: 1 }); // Пошук планів клієнта
workoutPlanSchema.index({ trainerId: 1, clientId: 1 }); // Складний індекс для пошуку планів тренера для конкретного клієнта

// Складний індекс для пошуку за датами (для occurrences)
// Використовуємо sparse index, оскільки trainingDate може містити різні структури
workoutPlanSchema.index({ 'occurrences.trainingDate': 1 }, { sparse: true });

// Експорт моделі
export const WorkoutPlan: IWorkoutPlanModel =
  (mongoose.models.WorkoutPlan as IWorkoutPlanModel) ||
  mongoose.model<IWorkoutPlan, IWorkoutPlanModel>('WorkoutPlan', workoutPlanSchema);

