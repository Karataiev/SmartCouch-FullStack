import bcrypt from 'bcrypt';

/**
 * Кількість раундів хешування (salt rounds)
 * Чим більше раундів, тим безпечніше, але повільніше
 * 10 раундів - оптимальний баланс між безпекою та швидкістю
 */
const SALT_ROUNDS = 10;

/**
 * Хешування паролю
 * Перетворює звичайний пароль в безпечний хеш, який можна зберігати в БД
 *
 * Процес:
 * 1. Генерується випадковий salt (сіль)
 * 2. Пароль + salt хешуються через bcrypt
 * 3. Результат: хеш, який містить salt та хешований пароль
 *
 * @param password - Пароль користувача в відкритому вигляді
 * @returns Promise з хешованим паролем
 *
 * @example
 * const hashedPassword = await hashPassword('mySecurePassword123');
 * // Результат: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Валідація паролю перед хешуванням
  if (!password || password.length < 8) {
    throw new Error('Пароль має бути мінімум 8 символів');
  }

  // Генерація хешу з використанням bcrypt
  // bcrypt автоматично генерує salt та додає його до хешу
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return hashedPassword;
};

/**
 * Порівняння паролю з хешем
 * Перевіряє, чи відповідає введений пароль збереженому хешу
 *
 * Процес:
 * 1. Bcrypt витягує salt з хешу
 * 2. Хешує введений пароль з цим salt
 * 3. Порівнює результат з збереженим хешем
 *
 * @param password - Пароль користувача в відкритому вигляді
 * @param hash - Хешований пароль з БД
 * @returns Promise з boolean: true якщо паролі співпадають
 *
 * @example
 * const isValid = await comparePassword('mySecurePassword123', hashedPassword);
 * if (isValid) {
 *   // Пароль правильний
 * }
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  // Валідація вхідних даних
  if (!password || !hash) {
    return false;
  }

  try {
    // Порівняння паролю з хешем
    // bcrypt.compare автоматично витягує salt з хешу та порівнює
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    // Якщо хеш має невірний формат, повертаємо false
    return false;
  }
};

/**
 * Перевірка сили паролю
 * Додаткова валідація для забезпечення безпеки
 *
 * @param password - Пароль для перевірки
 * @returns Об'єкт з результатом перевірки
 *
 * @example
 * const check = validatePasswordStrength('MyP@ssw0rd');
 * if (!check.isValid) {
 *   console.log(check.errors);
 * }
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Мінімальна довжина
  if (password.length < 8) {
    errors.push('Пароль має бути мінімум 8 символів');
  }

  // Максимальна довжина (захист від DoS атак)
  if (password.length > 128) {
    errors.push('Пароль не може бути довше 128 символів');
  }

  // Наявність великої літери
  if (!/[A-ZА-ЯІЇЄ]/.test(password)) {
    errors.push('Пароль має містити хоча б одну велику літеру');
  }

  // Наявність малої літери
  if (!/[a-zа-яіїє]/.test(password)) {
    errors.push('Пароль має містити хоча б одну малу літеру');
  }

  // Наявність цифри
  if (!/\d/.test(password)) {
    errors.push('Пароль має містити хоча б одну цифру');
  }

  // Опціонально: спеціальні символи (не обов'язково, але бажано)
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   errors.push('Пароль має містити хоча б один спеціальний символ');
  // }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

