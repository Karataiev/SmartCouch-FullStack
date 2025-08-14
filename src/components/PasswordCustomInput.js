import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SvgShowPassword} from '../assets/authorization/SvgShowPassword';
import {SvgHidePassword} from '../assets/authorization/SvgHidePassword';

export const PasswordCustomInput = ({
  password,
  setPassword,
  placeholder,
  setPasswordError,
  registration,
}) => {
  const [secure, setSecure] = useState(true);

  const toggleSecure = () => setSecure(prev => !prev);

  const validatePassword = rawPassword => {
    const trimmedPassword = rawPassword.replace(/\s/g, '');
    setPassword(trimmedPassword);

    if (registration) {
      if (trimmedPassword.length < 8) {
        return 'Довжина паролю повинна бути не менше 8-ми символів';
      } else if (trimmedPassword.length > 20) {
        return 'Довжина паролю повинна бути не більше 20-ти символів';
      } else if (!/[A-Z]/.test(trimmedPassword)) {
        return 'Пароль повинен містити мінімум 1 велику літеру';
      } else if (!/\d/.test(trimmedPassword)) {
        return 'Пароль повинен містити мінімум 1 велику цифру';
      }
    }
    return '';
  };

  const handlePasswordChange = value => {
    const error = validatePassword(value);
    setPasswordError(error);
  };

  return (
    <View style={[styles.container]}>
      {placeholder && !registration && (
        <Text style={styles.inputHeader}>{placeholder}</Text>
      )}
      <TextInput
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={secure}
        keyboardType="default"
        placeholder={placeholder}
        placeholderTextColor="#A1A1A1"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      <TouchableOpacity
        style={[styles.showHideBtn, registration && styles.showHideBtnTop]}
        onPress={() => toggleSecure()}>
        {secure ? <SvgShowPassword /> : <SvgHidePassword />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 20,
    width: '100%',
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
  secureInputText: {
    fontSize: 27,
  },
  inputHeader: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
    marginBottom: 4,
  },
  showHideBtn: {
    position: 'absolute',
    right: 0,
    top: '50%',
    padding: 8,
  },
  showHideBtnTop: {
    top: '25%',
  },
});
