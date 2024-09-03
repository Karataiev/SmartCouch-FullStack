import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const Container = ({children}) => {
  return <View style={styles.screenContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1C1C1C',
  },
});
