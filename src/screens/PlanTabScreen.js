import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container} from '../components/Container';
import {PlanScreenCalendar} from '../components/PlanScreenCalendar';

export const PlanTabScreen = () => {
  return (
    <Container>
      <PlanScreenCalendar />
      {/* <View>
        <Text>PlanTabScreen</Text>
      </View> */}
    </Container>
  );
};

const styles = StyleSheet.create({});
