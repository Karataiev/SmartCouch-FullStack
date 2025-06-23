import {StyleSheet, TextInput, View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';

export const ClientParametersDate = ({title, onChange, value}) => {
  const [date, setDate] = useState('');

  const formatDate = text => {
    const cleaned = text.replace(/\D+/g, '');
    const limited = cleaned.slice(0, 6);

    let formatted = '';
    if (limited.length <= 2) {
      formatted = limited;
    } else if (limited.length <= 4) {
      formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
    } else {
      formatted = `${limited.slice(0, 2)}/${limited.slice(
        2,
        4,
      )}/${limited.slice(4)}`;
    }

    setDate(formatted);
  };

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  useEffect(() => {
    onChange?.(date);
  }, [date]);

  return (
    <View style={styles.wrapper}>
      {title ? <Text style={styles.label}>{title}</Text> : null}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={date}
        onChangeText={formatDate}
        maxLength={8}
        placeholder="ДД/ММ/РР"
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 16,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderBottomColor: '#FFFFFF1A',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 16,
  },
});
