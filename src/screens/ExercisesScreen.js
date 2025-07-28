import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {LayoutComponent} from '../components/LayoutComponent';

export const ExercisesScreen = ({navigation}) => {
  return (
    <LayoutComponent>
      <StatusBar backgroundColor="#121313" />
      <View style={styles.container}>
        <HeaderWithBackButton navigation={navigation}>
          Вправи
        </HeaderWithBackButton>
      </View>
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
