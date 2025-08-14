import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

export const CustomInput = ({
  placeholder,
  value,
  setValue,
  inputType = 'default',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {placeholder && <Text style={styles.inputHeader}>{placeholder}</Text>}
      <TextInput
        value={value}
        onChangeText={setValue}
        style={[styles.input]}
        placeholder={placeholder}
        placeholderTextColor="#A1A1A1"
        keyboardType={inputType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    paddingHorizontal: 8,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
  inputHeader: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
    marginBottom: 4,
  },
});
