import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgAddBtn} from '../assets/svgIcons/SvgAddBtn';

export const CreateClientBtn = ({onPressAdd}) => {
  return (
    <TouchableOpacity style={styles.headerAddBtn} onPress={() => onPressAdd()}>
      <SvgAddBtn />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerAddBtn: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 200,
  },
});
