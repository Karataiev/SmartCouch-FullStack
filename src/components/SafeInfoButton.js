import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

export const SafeInfoButton = ({disabled, children, handleSubmit}) => {
  return (
    <HideWithKeyboard>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.submitBtn, disabled && {backgroundColor: '#363636'}]}
        onPress={() => handleSubmit()}>
        <Text style={[styles.submitBtnTitle, disabled && {color: '#A1A1A1'}]}>
          {children}
        </Text>
      </TouchableOpacity>
    </HideWithKeyboard>
  );
};

const styles = StyleSheet.create({
  submitBtn: {
    marginTop: 21,
    marginBottom: 21,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#FFFF65',
    borderRadius: 100,
  },
  submitBtnTitle: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    color: 'black',
  },
});
