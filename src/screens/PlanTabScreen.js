import React, {useState} from 'react';
import {Agenda} from '../components/Agenda';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {LayoutComponent} from '../components/LayoutComponent';
import {useCurrentDate} from '../castomHooks/useCurrentDate';

export const PlanTabScreen = () => {
  const today = useCurrentDate();
  const [pickedDate, setPickedDate] = useState(today);

  return (
    <LayoutComponent>
      <>
        <PlanScreenCalendar chooseDate={setPickedDate} />
        <Agenda date={pickedDate} />
      </>
    </LayoutComponent>
  );
};
