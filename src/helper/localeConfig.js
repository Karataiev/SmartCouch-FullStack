import {LocaleConfig} from 'react-native-calendars';

export const defaultLocaleConfig = locale => {
  LocaleConfig.locales[locale] = {
    monthNames: [
      'Січень',
      'Лютий',
      'Березень',
      'Квітень',
      'Травень',
      'Червень',
      'Липень',
      'Серпень',
      'Вересень',
      'Жовтень',
      'Листопад',
      'Грудень',
    ],
    monthNamesShort: [
      'Січ',
      'Лют',
      'Берез',
      'Квіт',
      'Трав',
      'Черв',
      'Лип',
      'Серп',
      'Верес',
      'Жовт',
      'Листоп',
      'Груд',
    ],
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ],
    dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    today: 'Сьогодні',
  };

  LocaleConfig.defaultLocale = locale;
};
