import {
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
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

export const TrainingPlanningScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [date, setDate] = useState(null);
  const [oneTimeTrainingDate, setOneTimeTrainingDate] = useState({});
  const [constantDate, setConstantDate] = useState([]);
  const [planningTrainingData, setPlanningTrainingData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const createTrainingPlan = () => {
    if (!date) return;

    const trainingPlanObject = {
      id: Date.now().toString(),
      oneTimeTrainingDate: oneTimeTrainingDate,
      constantTrainingDate: constantDate,
      trainingName: planningTrainingData.trainingName,
      trainingType: planningTrainingData.trainingType,
      client: planningTrainingData.client,
      location: planningTrainingData.location,
    };

    dispatch(createWorkoutPlan(trainingPlanObject));
    showToast('Тренування заплановано успішно');
    navigation.goBack();
  };

  return (
    <LayoutComponent>
      <StatusBar backgroundColor="#121313" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <ScrollView style={styles.container}>
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

            <SafeInfoButton disabled={!date} handleSubmit={createTrainingPlan}>
              Створити запис
            </SafeInfoButton>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
