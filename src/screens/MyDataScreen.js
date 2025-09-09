import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {MyDataComponent} from '../components/MyDataComponent';
import {LayoutComponent} from '../components/LayoutComponent';

export const MyDataScreen = ({navigation}) => {
  return (
    <LayoutComponent>
      <View style={styles.container}>
        <HeaderWithBackButton navigation={navigation}>
          Мої дані
        </HeaderWithBackButton>

        <MyDataComponent navigation={navigation} />
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
