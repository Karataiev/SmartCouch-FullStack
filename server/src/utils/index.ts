/**
 * Централізований експорт всіх утиліт
 * Дозволяє імпортувати утиліти з одного місця
 *
 * Приклад використання:
 * import { generateAccessToken, hashPassword, registerSchema } from '@/utils';
 */

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  getTokenExpiration,
  type JWTPayload,
  type TokenVerificationResult,
} from './jwt.util';

export {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} from './password.util';

export {
  normalizePhone,
  getPhoneSearchVariants,
} from './phone.util';

export {
  registerSchema,
  verifyCodeSchema,
  createPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  type RegisterInput,
  type VerifyCodeInput,
  type CreatePasswordInput,
  type LoginInput,
  type RefreshTokenInput,
  type LogoutInput,
  type ForgotPasswordInput,
} from './validators';

