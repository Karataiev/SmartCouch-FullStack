import React, {useEffect, useState} from 'react';
import {Agenda} from '../components/Agenda';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {LayoutComponent} from '../components/LayoutComponent';
import {useRoute} from '@react-navigation/native';

export const PlanTabScreen = () => {
  const route = useRoute();
  const [pickedDate, setPickedDate] = useState(null);

  useEffect(() => {
    setPickedDate(route.params?.itemData);
  }, [route]);

  return (
    <LayoutComponent>
      <>
        <PlanScreenCalendar date={pickedDate} chooseDate={setPickedDate} />
        <Agenda date={pickedDate} />
      </>
    </LayoutComponent>
  );
};
