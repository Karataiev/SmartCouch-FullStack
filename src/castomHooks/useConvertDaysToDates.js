import {useCallback} from 'react';

export const useConvertDaysToDates = () => {
  const daysMap = {
    Нд: 0,
    Пн: 1,
    Вт: 2,
    Ср: 3,
    Чт: 4,
    Пт: 5,
    Сб: 6,
  };

  const monthNames = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  const formatDate = dateObj => {
    const day = dateObj.getDate();
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year} р.`;
  };

  const convertConstantDates = useCallback((constantDate, weeksCount = 12) => {
    const today = new Date();
    let result = [];

    constantDate.forEach(({date, time}) => {
      const targetDay = daysMap[date];
      if (targetDay === undefined) return;

      let currentDate = new Date(today);
      const currentDay = currentDate.getDay();

      // якщо сьогодні збігається з targetDay → стартуємо з сьогодні
      let diff = targetDay - currentDay;
      if (diff < 0) {
        diff += 7;
      }
      currentDate.setDate(currentDate.getDate() + diff);

      // створюємо масив дат з кроком 7 днів
      for (let i = 0; i < weeksCount; i++) {
        const dateCopy = new Date(currentDate);
        dateCopy.setDate(currentDate.getDate() + i * 7);

        result.push({
          date: formatDate(dateCopy),
          time: [...time],
        });
      }
    });

    return result;
  }, []);

  return {convertConstantDates};
};
