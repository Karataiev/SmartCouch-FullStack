/**
 * Утиліти для трансформації даних з бекенду
 * MongoDB повертає _id, але фронтенд очікує id
 */

/**
 * Трансформує _id в id для одного об'єкта
 */
export const transformId = obj => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Якщо є _id, додаємо id
  if (obj._id && !obj.id) {
    obj.id = obj._id.toString();
  }

  // Видаляємо _id, якщо він є (залишаємо тільки id)
  if (obj._id) {
    delete obj._id;
  }

  return obj;
};

/**
 * Трансформує _id в id для масиву об'єктів
 */
export const transformIds = array => {
  if (!Array.isArray(array)) {
    return array;
  }

  return array.map(item => transformId(item));
};

/**
 * Рекурсивно трансформує _id в id для вкладених об'єктів
 */
export const transformIdsDeep = obj => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Якщо це масив
  if (Array.isArray(obj)) {
    return obj.map(item => transformIdsDeep(item));
  }

  // Трансформуємо поточний об'єкт
  const transformed = transformId({...obj});

  // Рекурсивно обробляємо всі властивості
  for (const key in transformed) {
    if (transformed.hasOwnProperty(key)) {
      const value = transformed[key];
      if (value && typeof value === 'object') {
        transformed[key] = transformIdsDeep(value);
      }
    }
  }

  return transformed;
};
