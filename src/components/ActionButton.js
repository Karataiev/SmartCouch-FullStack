import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export const ActionButton = ({onPress, icon, title}) => (
  <TouchableOpacity style={styles.additionalInfoBtn} onPress={onPress}>
    {icon}
    <Text style={styles.additionalInfoTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  additionalInfoBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 68,
    width: '30%',
    backgroundColor: '#232929',
    borderRadius: 10,
  },
  additionalInfoTitle: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 13,
    color: 'white',
  },
});
