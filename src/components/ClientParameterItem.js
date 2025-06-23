import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export const ClientParameterItem = ({item, value, onChangeText}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{item.label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          placeholder="0"
          placeholderTextColor="#888"
        />
        <Text style={styles.unit}>{item.unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#FFFFFF1A',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
  },
  unit: {
    color: '#aaa',
    fontSize: 16,
    marginLeft: 8,
  },
});
