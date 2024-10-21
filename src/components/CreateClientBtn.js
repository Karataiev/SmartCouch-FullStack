import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgAddBtn} from '../assets/svgIcons/SvgAddBtn';

export const CreateClientBtn = ({navigation}) => {
  const createNewClientBtn = () => {
    navigation.navigate('CreateClientScreen');
  };
  return (
    <TouchableOpacity
      style={styles.headerAddBtn}
      onPress={() => createNewClientBtn()}>
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
