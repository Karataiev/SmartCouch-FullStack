import {
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {DateAndTimeBlock} from '../components/DateAndTimeBlock';
import {TrainingPlanningContent} from '../components/TrainingPlanningContent';

export const TrainingPlanningScreen = () => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.constainer}>
        <StatusBar backgroundColor="#232323" />
        <HeaderWithBackButton>Створення запису</HeaderWithBackButton>
        <DateAndTimeBlock />
        <TrainingPlanningContent />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: '#232323',
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
