import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

export const CustomPhoneInput = ({
  placeholderTextColor = '#aaa',
  inputHeader = false,
  number,
  setNumber,
  style,
}) => {
  const mask = '+38 0** *** ** **';

  const handleFocusNumber = useCallback(() => {
    if (!number) {
      setNumber('+38 0');
    }
  }, [number, setNumber]);

  const handleOutNumber = useCallback(() => {
    if (!number || number.length <= 5) {
      setNumber('');
    }
  }, [number, setNumber]);

  return (
    <View style={style}>
      {inputHeader && <Text style={styles.inputHeader}>Телефон</Text>}
      <TextInputMask
        type="custom"
        options={{mask}}
        value={number}
        onChangeText={setNumber}
        onFocus={handleFocusNumber}
        onBlur={handleOutNumber}
        style={[styles.input]}
        placeholder="Телефон"
        placeholderTextColor={placeholderTextColor}
        keyboardType="numeric"
        maxLength={17}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    padding: 8,
    marginBottom: 20,
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
