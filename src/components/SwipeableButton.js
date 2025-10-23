import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export const SwipeableButton = ({
  icon,
  handleClick,
  children,
  singleButton,
}) => {
  const changeStyle =
    children === 'Видалити' ? styles.deleteBtn : styles.cancelBtn;

  return (
    <TouchableOpacity
      style={[styles.button, changeStyle, singleButton && styles.cancelBtn]}
      onPress={handleClick}>
      {icon}
      <Text style={styles.title}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232929',
    padding: 20,
    borderWidth: 1,
    borderBlockColor: '#4195B9',
  },
  deleteBtn: {
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
  },
  cancelBtn: {
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 13,
    fontWeight: '600',
    color: 'white',
  },
});
