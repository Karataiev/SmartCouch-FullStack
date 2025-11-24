/**
 * Централізований експорт всіх моделей
 * Дозволяє імпортувати моделі з одного місця
 *
 * Приклад використання:
 * import { User, RefreshToken } from '@/models';
 */

export { User, type IUser, type IUserModel } from './User.model';
export {
  RefreshToken,
  type IRefreshToken,
  type IRefreshTokenModel,
} from './RefreshToken.model';
export {
  VerificationCode,
  type IVerificationCode,
  type IVerificationCodeModel,
} from './VerificationCode.model';

