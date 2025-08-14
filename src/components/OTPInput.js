import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

export const OTPInput = ({code, setCode}) => {
  const inputsRef = useRef([]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < code.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputsRef.current[index] = ref)}
          value={digit}
          onChangeText={text => handleChange(text, index)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 32,
    width: 200,
    alignSelf: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    width: 40,
    fontSize: 24,
    color: '#fff',
  },
});
