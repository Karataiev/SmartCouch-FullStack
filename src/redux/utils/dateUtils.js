import {format, parse, isValid} from 'date-fns';
import {uk} from 'date-fns/locale';

const UKR_DATE_FORMAT = "d MMMM yyyy 'р.'";
const ISO_DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Конвертує українську дату в ISO формат
 * @param {string} ukrDate - Дата у форматі "d MMMM yyyy 'р.'"
 * @returns {string} - Дата у форматі ISO (yyyy-MM-dd) або порожній рядок
 */
export const convertUkrDateToISO = ukrDate => {
  if (!ukrDate || typeof ukrDate !== 'string') {
    return '';
  }

  try {
    const parsedDate = parse(ukrDate.trim(), UKR_DATE_FORMAT, new Date(), {
      locale: uk,
    });
    if (!isValid(parsedDate)) {
      return '';
    }
    return format(parsedDate, ISO_DATE_FORMAT);
  } catch {
    return '';
  }
};

/**
 * Конвертує ISO дату в український формат
 * @param {string} isoDate - Дата у форматі ISO (yyyy-MM-dd)
 * @returns {string} - Дата у форматі "d MMMM yyyy 'р.'" або порожній рядок
 */
export const convertISOToUkrDate = isoDate => {
  if (!isoDate || typeof isoDate !== 'string') {
    return '';
  }

  try {
    const parsedDate = parse(isoDate.trim(), ISO_DATE_FORMAT, new Date());
    if (!isValid(parsedDate)) {
      return '';
    }
    return format(parsedDate, UKR_DATE_FORMAT, {locale: uk});
  } catch {
    return '';
  }
};

/**
 * Валідує ISO дату
 * @param {string} isoDate - Дата у форматі ISO
 * @returns {boolean}
 */
export const isValidISODate = isoDate => {
  if (!isoDate || typeof isoDate !== 'string') {
    return false;
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(isoDate)) {
    return false;
  }
  try {
    const parsedDate = parse(isoDate, ISO_DATE_FORMAT, new Date());
    return isValid(parsedDate);
  } catch {
    return false;
  }
};

/**
 * Валідує українську дату
 * @param {string} ukrDate - Дата у форматі "d MMMM yyyy 'р.'"
 * @returns {boolean}
 */
export const isValidUkrDate = ukrDate => {
  if (!ukrDate || typeof ukrDate !== 'string') {
    return false;
  }
  try {
    const parsedDate = parse(ukrDate.trim(), UKR_DATE_FORMAT, new Date(), {
      locale: uk,
    });
    return isValid(parsedDate);
  } catch {
    return false;
  }
};

/**
 * Нормалізує значення дати (для порівняння)
 * @param {any} value - Значення дати
 * @returns {string} - Нормалізована дата або порожній рядок
 */
export const normalizeDateValue = value => {
  if (!value) {
    return '';
  }
  if (typeof value?.date === 'object' && value.date?.date) {
    return String(value.date.date).trim();
  }
  return String(value?.date ?? value ?? '').trim();
};

/**
 * Конвертує ISO дату в зручний формат для відображення (dd.MM.yyyy)
 * @param {string} isoDate - Дата у форматі ISO (yyyy-MM-dd або ISO datetime)
 * @returns {string} - Дата у форматі dd.MM.yyyy або порожній рядок
 */
export const formatISOToDisplay = isoDate => {
  if (!isoDate || typeof isoDate !== 'string') {
    return '';
  }

  try {
    // Витягуємо дату з ISO datetime формату (якщо є час)
    const dateOnly = isoDate.split('T')[0];
    const date = parse(dateOnly, ISO_DATE_FORMAT, new Date());
    
    if (!isValid(date)) {
      return '';
    }
    
    // Форматуємо в dd.MM.yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  } catch {
    return '';
  }
};

/**
 * Парсить дату з різних форматів (dd.MM.yyyy, dd.MM.yy, dd/MM/yyyy, тощо) та конвертує в ISO формат
 * @param {string} dateString - Дата у довільному форматі
 * @returns {string} - Дата у форматі ISO (yyyy-MM-dd) або порожній рядок якщо не вдалося розпарсити
 */
export const parseDateToISO = dateString => {
  if (!dateString || typeof dateString !== 'string') {
    return '';
  }

  const trimmed = dateString.trim();
  if (!trimmed) {
    return '';
  }

  // Спроба парсингу різних форматів
  const formats = [
    // dd.MM.yyyy
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
    // dd.MM.yy
    /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/,
    // dd/MM/yyyy
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // dd/MM/yy
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
    // dd-MM-yyyy
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    // dd-MM-yy
    /^(\d{1,2})-(\d{1,2})-(\d{2})$/,
  ];

  for (const format of formats) {
    const match = trimmed.match(format);
    if (match) {
      let day = parseInt(match[1], 10);
      let month = parseInt(match[2], 10);
      let year = parseInt(match[3], 10);

      // Якщо рік у форматі yy, конвертуємо в yyyy
      if (year < 100) {
        // Якщо yy < 50, вважаємо 20yy, інакше 19yy
        year = year < 50 ? 2000 + year : 1900 + year;
      }

      // Валідація днів та місяців
      if (day < 1 || day > 31 || month < 1 || month > 12) {
        continue;
      }

      // Створюємо дату та перевіряємо валідність
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        // Форматуємо в ISO формат (yyyy-MM-dd)
        const isoYear = date.getFullYear();
        const isoMonth = String(date.getMonth() + 1).padStart(2, '0');
        const isoDay = String(date.getDate()).padStart(2, '0');
        return `${isoYear}-${isoMonth}-${isoDay}`;
      }
    }
  }

  // Якщо не знайдено жодного формату, спробуємо стандартний парсинг Date
  try {
    const date = new Date(trimmed);
    if (isValid(date)) {
      return format(date, ISO_DATE_FORMAT);
    }
  } catch {
    // Ігноруємо помилки
  }

  return '';
};





