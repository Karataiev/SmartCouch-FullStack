import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const HeaderForScreens = ({children}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 9,
  },
  header: {
    width: '100%',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 26,
    color: 'white',
  },
});
