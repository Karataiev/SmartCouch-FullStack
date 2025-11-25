/**
 * Централізований експорт всіх роутів
 * Дозволяє імпортувати роути з одного місця
 *
 * Приклад використання:
 * import { authRoutes, userRoutes } from '@/routes';
 */

export { default as authRoutes } from './auth.routes';
export { default as userRoutes } from './user.routes';
export { default as clientsRoutes } from './clients.routes';
export { default as workoutPlansRoutes } from './workoutPlans.routes';
export { default as programsRoutes } from './programs.routes';

