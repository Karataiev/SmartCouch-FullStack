import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

export const OTPInput = ({code, setCode, length = 4}) => {
  const inputsRef = useRef([]);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  // Забезпечуємо правильну довжину коду
  const normalizedCode = code.length === length ? code : Array(length).fill('');

  const handleChange = (text, index) => {
    // Якщо вставлено код (текст більше 1 символу) - розподіляємо по інпутах
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, length); // Видаляємо нецифрові символи і обмежуємо довжиною
      const newCode = [...normalizedCode];
      
      // Заповнюємо інпути починаючи з поточного індексу
      for (let i = 0; i < digits.length && index + i < length; i++) {
        newCode[index + i] = digits[i];
      }
      
      setCode(newCode);
      
      // Фокусуємо останній заповнений інпут або наступний порожній
      const lastFilledIndex = Math.min(index + digits.length - 1, length - 1);
      const nextEmptyIndex = newCode.findIndex(
        (digit, idx) => idx > lastFilledIndex && digit === '',
      );
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex;
      
      setTimeout(() => {
        inputsRef.current[focusIndex]?.focus();
      }, 0);
      return;
    }

    // Звичайна обробка одного символу
    const newCode = [...normalizedCode];
    const previousValue = newCode[index];
    // Беремо тільки перший символ, якщо це цифра
    const digit = text.replace(/\D/g, '').charAt(0) || '';
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < normalizedCode.length - 1) {
      // Якщо введено цифру - переходимо на наступний інпут
      inputsRef.current[index + 1]?.focus();
    } else if (!digit && previousValue && index > 0) {
      // Якщо текст видалено і був попередній символ - переходимо на попередній інпут
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = ({nativeEvent}, index) => {
    // Якщо натиснуто backspace і поточний інпут порожній - переходимо на попередній
    if (nativeEvent.key === 'Backspace' && normalizedCode[index] === '') {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index) => {
    // Якщо це перша взаємодія і всі інпути порожні - фокусуємо перший
    if (isFirstInteraction && normalizedCode.every(digit => digit === '')) {
      setIsFirstInteraction(false);
      inputsRef.current[0]?.focus();
    } else {
      setIsFirstInteraction(false);
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
          onKeyPress={e => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          style={styles.input}
          keyboardType="numeric"
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
