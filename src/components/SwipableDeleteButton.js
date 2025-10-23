import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgRemoveBtn} from '../assets/svgIcons/SvgRemoveBtn';
import {SwipeableButton} from './SwipeableButton';

export const SwipeableDeleteButton = handleDeleteBtn => {
  return (
    <View style={styles.constainer}>
      <SwipeableButton
        icon={<SvgRemoveBtn />}
        handleClick={handleDeleteBtn}
        singleButton={true}>
        Видалити
      </SwipeableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    flexDirection: 'row',
  },
});
