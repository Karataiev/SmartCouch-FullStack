import mongoose, { Schema, Document, Model } from 'mongoose';
import { normalizePhone } from '@/utils/phone.util';

/**
 * Інтерфейс для connection method (спосіб зв'язку)
 */
export interface IConnectionMethod {
  type: string; // 'Instagram', 'Telegram', 'Viber', 'WhatsApp', тощо
  link: string; // URL або username
  icon?: string; // Назва іконки (опціонально)
}

/**
 * Інтерфейс для програми клієнта
 */
export interface IClientProgram {
  id?: mongoose.Types.ObjectId; // Reference to Program
  title?: string;
  program?: any; // Програма тренувань (будь-яка структура)
}

/**
 * Інтерфейс для документа Client в MongoDB
 */
export interface IClient extends Document {
  trainerId: mongoose.Types.ObjectId; // Reference to User (тренер)
  name: string;
  surname: string;
  phone: string;
  connectionMethods: IConnectionMethod[];
  targetAndWishes?: string; // Цілі та основні побажання
  stateOfHealth?: string; // Стан здоров'я (травми / протипоказання)
  levelOfPhysical?: string; // Рівень фізичної підготовки
  notes?: string; // Замітки
  program?: IClientProgram; // Призначена програма
  parameters: any[]; // Параметри клієнта (вага, зріст, тощо)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Інтерфейс для статичних методів моделі
 */
export interface IClientModel extends Model<IClient> {
  // Тут можна додати статичні методи, якщо потрібно
}

/**
 * Схема для connection method
 */
const connectionMethodSchema = new Schema<IConnectionMethod>(
  {
    type: {
      type: String,
      required: [true, 'Тип способу зв\'язку обов\'язковий'],
      trim: true,
    },
    link: {
      type: String,
      required: [true, 'Посилання обов\'язкове'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false, // Не створюємо окремий _id для піддокумента
  }
);

/**
 * Схема для програми клієнта
 */
const clientProgramSchema = new Schema<IClientProgram>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
    },
    title: {
      type: String,
      trim: true,
    },
    program: {
      type: Schema.Types.Mixed, // Будь-яка структура
    },
  },
  {
    _id: false,
  }
);

/**
 * Схема Mongoose для клієнта
 */
const clientSchema = new Schema<IClient>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID тренера обов\'язковий'],
      index: true, // Індекс для швидкого пошуку клієнтів тренера
    },
    name: {
      type: String,
      required: [true, 'Ім\'я обов\'язкове'],
      trim: true,
      maxlength: [50, 'Ім\'я не може бути довше 50 символів'],
    },
    surname: {
      type: String,
      required: [true, 'Прізвище обов\'язкове'],
      trim: true,
      maxlength: [50, 'Прізвище не може бути довше 50 символів'],
    },
    phone: {
      type: String,
      required: [true, 'Номер телефону обов\'язковий'],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Невірний формат номера телефону'],
    },
    connectionMethods: {
      type: [connectionMethodSchema],
      default: [],
      validate: {
        validator: function (methods: IConnectionMethod[]) {
          // Перевірка на унікальність типів
          const types = methods.map((m) => m.type);
          return types.length === new Set(types).size;
        },
        message: 'Типи способів зв\'язку мають бути унікальними',
      },
    },
    targetAndWishes: {
      type: String,
      trim: true,
      maxlength: [500, 'Цілі та побажання не можуть бути довше 500 символів'],
    },
    stateOfHealth: {
      type: String,
      trim: true,
      maxlength: [500, 'Стан здоров\'я не може бути довше 500 символів'],
    },
    levelOfPhysical: {
      type: String,
      trim: true,
      maxlength: [200, 'Рівень фізичної підготовки не може бути довше 200 символів'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Замітки не можуть бути довше 1000 символів'],
    },
    program: {
      type: clientProgramSchema,
    },
    parameters: {
      type: [Schema.Types.Mixed] as any, // Масив будь-яких об'єктів
      default: [],
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
    collection: 'clients', // Явно вказуємо назву колекції
  }
);

// Індекси для швидкого пошуку
clientSchema.index({ trainerId: 1 }); // Пошук клієнтів тренера
clientSchema.index({ trainerId: 1, name: 1, surname: 1 }); // Складний індекс для пошуку
clientSchema.index({ phone: 1 }); // Пошук за телефоном (якщо потрібно)

// Pre-save hook для нормалізації номера телефону
clientSchema.pre('save', function (next) {
  if (this.isModified('phone') && (this as any).phone) {
    (this as any).phone = normalizePhone((this as any).phone);
  }
  next();
});

// Pre-update hook для нормалізації номера телефону при оновленні
clientSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as any;
  if (update && update.phone) {
    update.phone = normalizePhone(update.phone);
  }
  next();
});

// Експорт моделі
export const Client: IClientModel =
  (mongoose.models.Client as IClientModel) ||
  mongoose.model<IClient, IClientModel>('Client', clientSchema);

