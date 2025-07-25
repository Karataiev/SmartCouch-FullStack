import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {SvgWatch} from '../assets/svgIcons/SvgWatch';

export const TimeInputComponent = ({timeFrom, timeTo, onChange}) => {
  const formatTime = text => {
    const numbers = text.replace(/[^\d]/g, '').slice(0, 4);
    if (numbers.length >= 3) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    }
    if (numbers.length >= 1) return numbers;
    return '';
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
          onChangeText={text => onChange(formatTime(text), timeTo)}
          maxLength={5}
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          style={styles.input}
          placeholder="00:00"
          placeholderTextColor="#888"
          value={timeTo}
          keyboardType="numeric"
          onChangeText={text => onChange(timeFrom, formatTime(text))}
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
