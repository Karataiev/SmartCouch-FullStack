import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';

export const ScheduledTrainingScreen = () => {
  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <HeaderWithBackButton>Данні запису</HeaderWithBackButton>
        </ScrollView>
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
