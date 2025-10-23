import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgRemoveBtn} from '../assets/svgIcons/SvgRemoveBtn';
import {SvgEditBtn} from '../assets/svgIcons/SvgEditBtn';
import {SwipeableButton} from './SwipeableButton';

export const SwipeableRightButtons = (
  isCancelActive,
  handleCancelBtn,
  handleDeleteBtn,
) => {
  return (
    <View style={styles.constainer}>
      <SwipeableButton icon={<SvgRemoveBtn />} handleClick={handleDeleteBtn}>
        Видалити
      </SwipeableButton>
      <SwipeableButton icon={<SvgEditBtn />} handleClick={handleCancelBtn}>
        {!isCancelActive ? 'Відмінити' : 'Відновити'}
      </SwipeableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    flexDirection: 'row',
  },
});
