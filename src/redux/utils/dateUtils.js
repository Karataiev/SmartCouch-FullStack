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





