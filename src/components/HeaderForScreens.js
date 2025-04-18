import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {CreateClientBtn} from './CreateClientBtn';

export const HeaderForScreens = ({children, addBtn, onPressAdd}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{children}</Text>
      {addBtn && <CreateClientBtn onPressAdd={onPressAdd} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 26,
    color: 'white',
  },
});
