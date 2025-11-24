import React, {useRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

export const OTPInput = ({code, setCode, length = 4}) => {
  const inputsRef = useRef([]);

  // Забезпечуємо правильну довжину коду
  const normalizedCode = code.length === length ? code : Array(length).fill('');

  const handleChange = (text, index) => {
    const newCode = [...normalizedCode];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < normalizedCode.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {normalizedCode.map((digit, index) => (
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
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    fontSize: 24,
    color: '#fff',
    flex: 1,
    marginHorizontal: 4,
    minWidth: 35,
  },
});
