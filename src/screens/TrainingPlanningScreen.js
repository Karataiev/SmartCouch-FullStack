import {ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {DateAndTimeBlock} from '../components/DateAndTimeBlock';
import {TrainingPlanningContent} from '../components/TrainingPlanningContent';
import {DayAndTimeBlock} from '../components/DayAndTimeBlock';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useDispatch} from 'react-redux';
import {createWorkoutPlan} from '../redux/action';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../castomHooks/useToast';
import {LayoutComponent} from '../components/LayoutComponent';
import {useCurrentDate} from '../castomHooks/useCurrentDate';
import {generateId} from '../helper/generateId';
import {useConvertDaysToDates} from '../castomHooks/useConvertDaysToDates';

export const TrainingPlanningScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const today = useCurrentDate();
  const {convertConstantDates} = useConvertDaysToDates();

  const [date, setDate] = useState(null);
  const [oneTimeTrainingDate, setOneTimeTrainingDate] = useState([]);
  const [constantDate, setConstantDate] = useState([]);
  const [planningTrainingData, setPlanningTrainingData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDisableBtn, setIsDisableBtn] = useState(true);
  const [isActiveConstantBlock, setIsActiveConstantBlock] = useState(false);

  const filterConstantDate = data => {
    const constantDateArr = data.filter(
      el => el.time[0].length !== 0 && el.time[1].length !== 0,
    );
    return constantDateArr;
  };

  useEffect(() => {
    if (filterConstantDate(constantDate).length !== 0) {
      setIsActiveConstantBlock(true);
    } else {
      setIsActiveConstantBlock(false);
    }
  }, [constantDate]);

  useEffect(() => {
    if (
      (oneTimeTrainingDate[0]?.date &&
        oneTimeTrainingDate[0]?.time[0] &&
        oneTimeTrainingDate[0]?.time[1]) ||
      filterConstantDate(constantDate).length !== 0
    ) {
      setIsDisableBtn(false);
    } else {
      setIsDisableBtn(true);
    }
  }, [date, oneTimeTrainingDate, constantDate]);

  function isFutureOrToday(trainingDate, currentDate) {
    const training = new Date(trainingDate);
    const current = new Date(currentDate);

    training.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    return training >= current;
  }

  const createTrainingPlan = () => {
    if (!isActiveConstantBlock && !isFutureOrToday(date, today)) {
      showToast('Неможливо запланувати тренування на дату у минулому!');
    } else {
      const changeDaysToDates = () => {
        if (oneTimeTrainingDate.length !== 0) {
          return oneTimeTrainingDate;
        } else {
          return convertConstantDates(constantDate);
        }
      };

      const id = generateId();

      const trainingPlanObject = {
        id: id,
        trainingDate: changeDaysToDates(),
        trainingName: planningTrainingData.trainingName,
        trainingType: planningTrainingData.trainingType,
        client: planningTrainingData.client,
        location: planningTrainingData.location,
      };

      dispatch(createWorkoutPlan(trainingPlanObject));
      showToast('Тренування заплановано успішно');
      navigation.goBack();
    }
  };

  return (
    <LayoutComponent>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}>
        <HeaderWithBackButton>Створення запису</HeaderWithBackButton>

        <DateAndTimeBlock
          date={date}
          setDate={setDate}
          isDatePickerVisible={isDatePickerVisible}
          setDatePickerVisibility={setDatePickerVisibility}
          setOneTimeTrainingDate={setOneTimeTrainingDate}
        />

        <DayAndTimeBlock setConstantDate={setConstantDate} />

        <TrainingPlanningContent
          setPlanningTrainingData={setPlanningTrainingData}
        />

        <SafeInfoButton
          disabled={isDisableBtn}
          handleSubmit={createTrainingPlan}>
          Створити запис
        </SafeInfoButton>
      </ScrollView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
    paddingHorizontal: 20,
  },
  contentContainerStyle: {
    paddingBottom: 40,
  },
});
