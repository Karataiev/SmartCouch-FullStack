import { VerificationCode, type IVerificationCode } from '@/models';
import { env } from '@/config/env';
import { logger } from '@/config/logger';

/**
 * Константи для SMS сервісу
 */
const CODE_LENGTH = 6; // Довжина коду верифікації
const CODE_EXPIRY_MINUTES = 10; // Термін дії коду (10 хвилин)
const MAX_ATTEMPTS = 3; // Максимальна кількість спроб введення коду
const MAX_SMS_PER_HOUR = 3; // Максимальна кількість SMS на номер за годину
const MAX_SMS_PER_DAY = 10; // Максимальна кількість SMS на номер за добу

/**
 * Генерація випадкового 6-значного коду верифікації
 *
 * @returns 6-значний код у вигляді рядка
 *
 * @example
 * const code = generateVerificationCode(); // "123456"
 */
export const generateVerificationCode = (): string => {
  // Генерація випадкового числа від 100000 до 999999
  const min = 100000;
  const max = 999999;
  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return code.toString().padStart(CODE_LENGTH, '0'); // Забезпечуємо 6 цифр з ведучими нулями
};

/**
 * Перевірка rate limiting для SMS
 * Обмежує кількість SMS на номер телефону
 *
 * @param phone - Номер телефону
 * @returns Promise з boolean: true якщо можна відправити SMS
 */
export const checkSmsRateLimit = async (phone: string): Promise<{
  allowed: boolean;
  reason?: string;
}> => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Перевірка кількості SMS за останню годину
    const smsLastHour = await VerificationCode.countDocuments({
      phone,
      createdAt: { $gte: oneHourAgo },
    });

    if (smsLastHour >= MAX_SMS_PER_HOUR) {
      return {
        allowed: false,
        reason: `Перевищено ліміт SMS. Максимум ${MAX_SMS_PER_HOUR} SMS на годину. Спробуйте пізніше.`,
      };
    }

    // Перевірка кількості SMS за останню добу
    const smsLastDay = await VerificationCode.countDocuments({
      phone,
      createdAt: { $gte: oneDayAgo },
    });

    if (smsLastDay >= MAX_SMS_PER_DAY) {
      return {
        allowed: false,
        reason: `Перевищено ліміт SMS. Максимум ${MAX_SMS_PER_DAY} SMS на добу. Спробуйте пізніше.`,
      };
    }

    return { allowed: true };
  } catch (error) {
    logger.error({ error, phone }, 'Помилка перевірки rate limit для SMS');
    // У разі помилки дозволяємо відправку (fail-open для надійності)
    return { allowed: true };
  }
};

/**
 * Відправка SMS коду через Twilio (або mock в development)
 *
 * @param phone - Номер телефону отримувача
 * @param code - Код верифікації
 * @returns Promise з boolean: true якщо SMS відправлено успішно
 */
export const sendVerificationCode = async (
  phone: string,
  code: string
): Promise<boolean> => {
  try {
    // Mock режим для development (якщо Twilio не налаштовано)
    if (
      env.NODE_ENV === 'development' &&
      (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN)
    ) {
      logger.info(
        { phone, code },
        '📱 [MOCK] SMS код верифікації (Twilio не налаштовано)'
      );
      // В development режимі просто логуємо код
      // Використовуємо console.log для гарантованого виводу
      console.log('\n' + '='.repeat(50));
      console.log(`📱 SMS КОД ВЕРИФІКАЦІЇ`);
      console.log(`📞 Номер: ${phone}`);
      console.log(`🔑 Код: ${code}`);
      console.log('='.repeat(50) + '\n');
      return true;
    }

    // Реальна відправка через Twilio
    if (env.SMS_PROVIDER === 'twilio' && env.TWILIO_ACCOUNT_SID) {
      try {
        // Динамічний require Twilio (щоб не вимагати залежність в development)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const twilio = require('twilio');
        const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

        const message = await client.messages.create({
          body: `Ваш код верифікації SmartCoach: ${code}. Дійсний протягом ${CODE_EXPIRY_MINUTES} хвилин.`,
          from: env.TWILIO_PHONE_NUMBER,
          to: phone,
        });

        logger.info(
          { phone, messageSid: message.sid },
          '✅ SMS код відправлено через Twilio'
        );
        return true;
      } catch (importError: any) {
        // Якщо Twilio не встановлено, використовуємо mock
        if (importError.code === 'MODULE_NOT_FOUND') {
          logger.warn(
            { phone },
            '⚠️ Twilio не встановлено, використовується mock режим'
          );
          console.log('\n' + '='.repeat(50));
          console.log(`📱 SMS КОД ВЕРИФІКАЦІЇ`);
          console.log(`📞 Номер: ${phone}`);
          console.log(`🔑 Код: ${code}`);
          console.log('='.repeat(50) + '\n');
          return true;
        }
        throw importError;
      }
    }

    // Якщо провайдер не налаштовано
    logger.warn(
      { phone, provider: env.SMS_PROVIDER },
      '⚠️ SMS провайдер не налаштовано, використовується mock режим'
    );
    console.log('\n' + '='.repeat(50));
    console.log(`📱 SMS КОД ВЕРИФІКАЦІЇ`);
    console.log(`📞 Номер: ${phone}`);
    console.log(`🔑 Код: ${code}`);
    console.log('='.repeat(50) + '\n');
    return true;
  } catch (error) {
    logger.error({ error, phone }, '❌ Помилка відправки SMS коду');
    return false;
  }
};

/**
 * Зберігання коду верифікації в БД з TTL
 *
 * @param phone - Номер телефону
 * @param code - Код верифікації
 * @returns Promise з збереженим документом
 */
export const storeVerificationCode = async (
  phone: string,
  code: string
): Promise<IVerificationCode> => {
  // Видаляємо старі коди для цього номера (якщо є)
  await VerificationCode.deleteMany({ phone });

  // Створюємо новий код з терміном дії
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + CODE_EXPIRY_MINUTES);

  const verificationCode = new VerificationCode({
    phone,
    code,
    attempts: 0,
    expiresAt,
  });

  await verificationCode.save();

  logger.info({ phone }, '💾 Код верифікації збережено в БД');

  return verificationCode;
};

/**
 * Валідація коду верифікації
 * Перевіряє код, термін дії та кількість спроб
 *
 * @param phone - Номер телефону
 * @param code - Код верифікації
 * @returns Promise з результатом валідації
 */
export const verifyCode = async (
  phone: string,
  code: string
): Promise<{
  valid: boolean;
  reason?: string;
  verificationCode?: IVerificationCode;
}> => {
  try {
    // Пошук коду в БД
    const verificationCode = await VerificationCode.findOne({
      phone,
      code,
    });

    // Якщо код не знайдено
    if (!verificationCode) {
      return {
        valid: false,
        reason: 'Невірний код верифікації',
      };
    }

    // Перевірка терміну дії
    if (verificationCode.expiresAt < new Date()) {
      // Видаляємо прострочений код
      await VerificationCode.deleteOne({ _id: verificationCode._id });
      return {
        valid: false,
        reason: 'Код верифікації прострочений',
      };
    }

    // Перевірка кількості спроб
    if (verificationCode.attempts >= MAX_ATTEMPTS) {
      // Видаляємо код після перевищення спроб
      await VerificationCode.deleteOne({ _id: verificationCode._id });
      return {
        valid: false,
        reason: `Перевищено максимальну кількість спроб (${MAX_ATTEMPTS}). Запишіть новий код.`,
      };
    }

    // Якщо код не співпадає, збільшуємо лічильник спроб
    if (verificationCode.code !== code) {
      verificationCode.attempts += 1;
      await verificationCode.save();

      const remainingAttempts = MAX_ATTEMPTS - verificationCode.attempts;
      return {
        valid: false,
        reason: `Невірний код. Залишилось спроб: ${remainingAttempts}`,
      };
    }

    // Код валідний - видаляємо його (одноразовий код)
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    logger.info({ phone }, '✅ Код верифікації підтверджено');

    return {
      valid: true,
      verificationCode,
    };
  } catch (error) {
    logger.error({ error, phone }, '❌ Помилка валідації коду');
    return {
      valid: false,
      reason: 'Помилка валідації коду',
    };
  }
};

/**
 * Генерація, зберігання та відправка коду верифікації
 * Основна функція для реєстрації користувача
 *
 * @param phone - Номер телефону
 * @returns Promise з результатом операції
 */
export const generateAndSendCode = async (phone: string): Promise<{
  success: boolean;
  message: string;
  code?: string; // Тільки в development для тестування
}> => {
  try {
    // Перевірка rate limiting
    const rateLimitCheck = await checkSmsRateLimit(phone);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        message: rateLimitCheck.reason || 'Перевищено ліміт SMS',
      };
    }

    // Генерація коду
    const code = generateVerificationCode();

    // Зберігання коду в БД
    await storeVerificationCode(phone, code);

    // Відправка SMS
    const sent = await sendVerificationCode(phone, code);
    if (!sent) {
      return {
        success: false,
        message: 'Помилка відправки SMS. Спробуйте пізніше.',
      };
    }

    // В development режимі повертаємо код для тестування
    if (env.NODE_ENV === 'development') {
      return {
        success: true,
        message: 'Код верифікації відправлено',
        code, // Тільки в development!
      };
    }

    return {
      success: true,
      message: 'Код верифікації відправлено на ваш номер телефону',
    };
  } catch (error) {
    logger.error({ error, phone }, '❌ Помилка генерації та відправки коду');
    return {
      success: false,
      message: 'Помилка генерації коду. Спробуйте пізніше.',
    };
  }
};

