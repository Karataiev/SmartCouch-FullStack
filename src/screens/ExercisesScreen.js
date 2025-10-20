import React from 'react';
import {StyleSheet} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const ExercisesScreen = ({navigation}) => {
  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton navigation={navigation}>
          Вправи
        </HeaderWithBackButton>
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
