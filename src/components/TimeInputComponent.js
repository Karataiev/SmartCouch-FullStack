import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {SvgWatch} from '../assets/svgIcons/SvgWatch';

export const TimeInputComponent = () => {
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');

  const formatTime = text => {
    // Видаляємо всі нецифри
    const numbersOnly = text.replace(/[^\d]/g, '');

    // Обмежуємо довжину до 4 символів (HHmm)
    const trimmed = numbersOnly.slice(0, 4);

    // Форматуємо у HH:mm
    if (trimmed.length >= 3) {
      return `${trimmed.slice(0, 2)}:${trimmed.slice(2)}`;
    } else if (trimmed.length >= 1) {
      return trimmed;
    }

    return '';
  };

  const handleChange = setter => text => {
    setter(formatTime(text));
  };

  return (
    <View style={styles.container}>
      <SvgWatch />
      <View style={styles.inputsWrapper}>
        <TextInput
          style={styles.input}
          placeholder="00:00"
          placeholderTextColor="#888"
          value={timeFrom}
          keyboardType="numeric"
          onChangeText={handleChange(setTimeFrom)}
          maxLength={5}
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          style={styles.input}
          placeholder="00:00"
          placeholderTextColor="#888"
          value={timeTo}
          keyboardType="numeric"
          onChangeText={handleChange(setTimeTo)}
          maxLength={5}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: '60%',
  },
  inputsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 8,
  },
  input: {
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 4,
    width: 60,
    textAlign: 'center',
  },
  dash: {
    fontSize: 18,
    color: 'white',
    marginHorizontal: 6,
  },
});
