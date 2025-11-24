import mongoose, { Schema, Document, Model } from 'mongoose';
import { normalizePhone } from '@/utils/phone.util';

/**
 * Інтерфейс для документа User в MongoDB
 * Описує структуру даних користувача
 */
export interface IUser extends Document {
  phone: string;
  password?: string; // Необов'язковий, оскільки може бути встановлений пізніше
  name?: string;
  surname?: string;
  email?: string;
  birthday?: Date;
  experience?: string;
  city?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Інтерфейс для статичних методів моделі (якщо потрібно)
 */
export interface IUserModel extends Model<IUser> {
  // Тут можна додати статичні методи, наприклад:
  // findByPhone(phone: string): Promise<IUser | null>;
}

/**
 * Схема Mongoose для користувача
 * Визначає структуру, валідацію та індекси
 */
const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: [true, 'Номер телефону обов\'язковий'],
      unique: true, // Унікальність на рівні БД
      index: true, // Індекс для швидкого пошуку
      trim: true, // Видалення пробілів
      match: [/^\+?[1-9]\d{1,14}$/, 'Невірний формат номера телефону'], // Базовий формат (E.164)
    },
    password: {
      type: String,
      required: false, // Не обов'язковий, оскільки може бути встановлений пізніше
      // Пароль буде хешований через bcrypt в сервісі перед збереженням
      validate: {
        validator: function (value: string | undefined) {
          // Якщо пароль встановлений, він має бути мінімум 8 символів
          return !value || value.length >= 8;
        },
        message: 'Пароль має бути мінімум 8 символів',
      },
      select: false, // Не повертати пароль за замовчуванням при запитах
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, 'Ім\'я не може бути довше 50 символів'],
    },
    surname: {
      type: String,
      trim: true,
      maxlength: [50, 'Прізвище не може бути довше 50 символів'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Невірний формат email'],
    },
    birthday: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          // Перевірка, що дата не в майбутньому
          return !value || value <= new Date();
        },
        message: 'Дата народження не може бути в майбутньому',
      },
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [200, 'Досвід не може бути довше 200 символів'],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'Місто не може бути довше 100 символів'],
    },
    avatar: {
      type: String,
      trim: true,
      // URL валідацію можна додати через match або в сервісі
    },
    isVerified: {
      type: Boolean,
      default: false, // За замовчуванням не верифікований
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
    collection: 'users', // Явно вказуємо назву колекції
  }
);

// Додатковий індекс для пошуку за телефоном (вже є через unique, але явно вказуємо)
userSchema.index({ phone: 1 });

// Індекс для пошуку верифікованих користувачів (якщо потрібно)
userSchema.index({ isVerified: 1 });

// Pre-save hook для нормалізації номера телефону перед збереженням
userSchema.pre('save', function (next) {
  if (this.isModified('phone') && this.phone) {
    this.phone = normalizePhone(this.phone);
  }
  next();
});

// Pre-update hook для нормалізації номера телефону при оновленні
userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as any;
  if (update && update.phone) {
    update.phone = normalizePhone(update.phone);
  }
  next();
});

// Експорт моделі
// Перевіряємо, чи модель вже існує (для hot reload в development)
export const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>('User', userSchema);

