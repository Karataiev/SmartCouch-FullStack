/**
 * Централізований експорт всіх сервісів
 * Дозволяє імпортувати сервіси з одного місця
 *
 * Приклад використання:
 * import { generateAndSendCode, verifyCode } from '@/services';
 */

export {
  generateVerificationCode,
  checkSmsRateLimit,
  sendVerificationCode,
  storeVerificationCode,
  verifyCode,
  generateAndSendCode,
} from './sms.service';

