import React from 'react';
import {StyleSheet} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {MyDataComponent} from '../components/MyDataComponent';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const MyDataScreen = ({navigation}) => {
  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton navigation={navigation}>
          Мої дані
        </HeaderWithBackButton>

        <MyDataComponent navigation={navigation} />
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
