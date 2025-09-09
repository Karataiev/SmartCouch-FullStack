import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {LayoutComponent} from '../components/LayoutComponent';

export const ReadyMadeProgramsScreen = ({navigation}) => {
  return (
    <LayoutComponent>
      <View style={styles.container}>
        <HeaderWithBackButton navigation={navigation}>
          Готові програми
        </HeaderWithBackButton>
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
    paddingHorizontal: 20,
  },
});
