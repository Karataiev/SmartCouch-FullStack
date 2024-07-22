import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SvgPlus} from '../assets/tabIcons/SvgPlus';

export const TabPlusButton = () => {
  return (
    <View style={styles.plusButtonContainer}>
      <TouchableOpacity style={styles.plusButton}>
        <SvgPlus />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#FFFF65',
    borderWidth: 6,
    borderRadius: 50,
  },
  plusButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
