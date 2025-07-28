import React from 'react';
import {StyleSheet, View} from 'react-native';

export const CheckboxComponent = ({pinned}) => {
  return (
    <View style={styles.checkbox}>
      <View style={pinned && styles.check} />
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    padding: 3,
    borderRadius: 50,
    borderColor: '#565656',
    borderWidth: 1,
  },
  check: {
    backgroundColor: '#3EB1CC',
    borderRadius: 50,
    width: '100%',
    height: '100%',
  },
});
