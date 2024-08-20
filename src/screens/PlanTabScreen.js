import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container} from '../components/Container';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';

export const PlanTabScreen = () => {
  return (
    <Container>
      <PlanScreenCalendar />
    </Container>
  );
};

const styles = StyleSheet.create({});
