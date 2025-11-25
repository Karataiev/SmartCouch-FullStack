import React, {useEffect, useState, useMemo} from 'react';
import {Agenda} from '../components/Agenda';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {LayoutComponent} from '../components/LayoutComponent';
import {useRoute} from '@react-navigation/native';

export const PlanTabScreen = () => {
  const route = useRoute();

  // Поточна дата в форматі ISO (YYYY-MM-DD)
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Ініціалізуємо з поточною датою за замовчуванням
  const [pickedDate, setPickedDate] = useState(() => {
    // Якщо є дата в route.params, використовуємо її, інакше - поточну дату
    return route.params?.itemData || new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    // Оновлюємо pickedDate, якщо передано нову дату через route.params
    if (route.params?.itemData) {
      setPickedDate(route.params.itemData);
    } else if (!pickedDate) {
      // Якщо дати немає, встановлюємо поточну
      setPickedDate(todayString);
    }
  }, [route, todayString, pickedDate]);

  return (
    <LayoutComponent>
      <>
        <PlanScreenCalendar date={pickedDate} chooseDate={setPickedDate} />
        <Agenda date={pickedDate} />
      </>
    </LayoutComponent>
  );
};
