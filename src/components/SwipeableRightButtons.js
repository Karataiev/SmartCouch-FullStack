import {StyleSheet, View} from 'react-native';
import React from 'react';
import {SvgRemoveBtn} from '../assets/svgIcons/SvgRemoveBtn';
import {SvgEditBtn} from '../assets/svgIcons/SvgEditBtn';
import {SwipeableButton} from './SwipeableButton';

export const SwipeableRightButtons = (isCancelActive, setIsCancelActive) => {
  const handleDeleteBtn = () => {};

  const handleCancelBtn = () => {
    setIsCancelActive(!isCancelActive);
  };

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
