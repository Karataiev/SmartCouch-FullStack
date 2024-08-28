import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container} from '../components/Container';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';
import {Agenda} from '../components/Agenda';

export const PlanTabScreen = () => {
  return (
    <Container>
      <PlanScreenCalendar />
      <Agenda />
    </Container>
  );
};

const styles = StyleSheet.create({});
