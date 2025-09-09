import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Agenda} from '../components/Agenda';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {LayoutComponent} from '../components/LayoutComponent';

export const PlanTabScreen = () => {
  return (
    <LayoutComponent>
      <View style={styles.content}>
        <PlanScreenCalendar />
        <Agenda />
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: 1,
  },
});
