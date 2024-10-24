import {LocaleConfig} from 'react-native-calendars';

export const monthArray = [
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
];

export const defaultLocaleConfig = locale => {
  LocaleConfig.locales[locale] = {
    monthNames: monthArray,
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
      'Понеділок',
      'Вівторок',
      'Середа',
      'Четвер',
      'Пятниця',
      'Субота',
      'Неділя',
    ],
    dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    today: 'Сьогодні',
  };

  LocaleConfig.defaultLocale = locale;
};
