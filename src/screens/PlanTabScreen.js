import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {Agenda} from '../components/Agenda';

export const PlanTabScreen = () => {
  return (
    <View style={styles.container}>
      <PlanScreenCalendar />
      <Agenda />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1C1C1C',
  },
});
