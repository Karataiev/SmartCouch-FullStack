import React, {useState, useMemo} from 'react';
import {Agenda} from '../components/Agenda';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {LayoutComponent} from '../components/LayoutComponent';
import {useRoute} from '@react-navigation/native';

export const PlanTabScreen = () => {
  const route = useRoute();

  // Поточна дата в форматі ISO (YYYY-MM-DD)
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Ініціалізуємо з датою з route.params (якщо є), інакше - з поточною
  const [pickedDate, setPickedDate] = useState(
    () => route.params?.itemData || todayString,
  );

  return (
    <LayoutComponent>
      <>
        <PlanScreenCalendar date={pickedDate} chooseDate={setPickedDate} />
        <Agenda date={pickedDate} />
      </>
    </LayoutComponent>
  );
};
