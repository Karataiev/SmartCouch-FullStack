import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const TabItemContainer = ({children, tabName, color}) => {
  return (
    <View style={styles.tabStyle}>
      {children}
      <Text style={[{color: color}, styles.labelStyle]}>{tabName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabStyle: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    fontSize: 12,
  },
});
