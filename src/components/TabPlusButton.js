import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgPlus} from '../assets/tabIcons/SvgPlus';
import {useDispatch, useSelector} from 'react-redux';
import {isPlusMenuBtn} from '../redux/action';

export const TabPlusButton = () => {
  const isBtnClick = useSelector(state => state.isPlusMenuBtn);
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(isPlusMenuBtn(!isBtnClick));
  };

  return (
    <View style={styles.plusButtonContainer}>
      <TouchableOpacity style={styles.plusButton} onPress={() => handlePress()}>
        <SvgPlus />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  plusButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  plusButton: {
    backgroundColor: '#3EB1CC',
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderWidth: 6,
    borderRadius: 50,
  },
});
