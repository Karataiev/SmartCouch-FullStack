/**
 * Утиліта для нормалізації номера телефону
 * Забезпечує однаковий формат для зберігання та пошуку
 */

/**
 * Нормалізує номер телефону до формату E.164
 * Видаляє пробіли, дефіси та інші символи
 * 
 * @param phone - Номер телефону в будь-якому форматі
 * @returns Нормалізований номер телефону
 * 
 * @example
 * normalizePhone('+38 098 123 45 67') // '+380981234567'
 * normalizePhone('380981234567') // '380981234567'
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) {
    return '';
  }

  // Видаляємо всі пробіли, дефіси та інші символи, крім цифр та +
  const normalized = phone.replace(/[\s-()]/g, '');

  return normalized;
};

/**
 * Нормалізує номер телефону для пошуку в БД
 * Перевіряє різні варіанти формату
 * 
 * @param phone - Номер телефону
 * @returns Масив можливих варіантів номера для пошуку
 */
export const getPhoneSearchVariants = (phone: string): string[] => {
  const normalized = normalizePhone(phone);
  const variants: string[] = [normalized];

  // Якщо номер починається з +, додаємо варіант без +
  if (normalized.startsWith('+')) {
    variants.push(normalized.substring(1));
  } else {
    // Якщо номер без +, додаємо варіант з +
    variants.push(`+${normalized}`);
  }

  // Видаляємо дублікати
  return [...new Set(variants)];
};

