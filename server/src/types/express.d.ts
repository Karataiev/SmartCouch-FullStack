import { Request } from 'express';
import { IClient } from '@/models/Client.model';
import { IWorkoutPlan } from '@/models/WorkoutPlan.model';
import { IProgram } from '@/models/Program.model';

/**
 * Розширення Express Request для додавання user після аутентифікації
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phone: string;
        isVerified: boolean;
      };
      client?: IClient; // Додається після перевірки власника клієнта
      workoutPlan?: IWorkoutPlan; // Додається після перевірки власника плану тренування
      program?: IProgram; // Додається після перевірки власника програми
    }
  }
}

export {};
