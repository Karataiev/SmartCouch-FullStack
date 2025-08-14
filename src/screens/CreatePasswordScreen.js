import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {PasswordCustomInput} from '../components/PasswordCustomInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useNavigation} from '@react-navigation/native';

export const CreatePasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [differentPasswordError, setDifferentPasswordError] = useState('');
  const [showError, setShowError] = useState(false);

  const handlePress = () => {
    if (passwordError.length > 0) {
      setShowError(true);
    } else if (password !== repeatPassword) {
      setShowError(true);
      setDifferentPasswordError('Паролі не співпадають.');
    } else if (password.length === 0 && repeatPassword.length === 0) {
      setShowError(true);
      setPasswordError('Придумайте пароль. Поля не можуть бути пустими.');
    } else {
      setShowError(false);
      navigation.navigate('Login');
    }
  };

  return (
    <LayoutComponent>
      <View style={styles.container}>
        <HeaderWithBackButton />
        <Text style={styles.header}>Створіть пароль</Text>

        <View style={styles.content}>
          <PasswordCustomInput
            password={password}
            setPassword={setPassword}
            setPasswordError={setPasswordError}
            placeholder="Пароль"
            registration={true}
          />
          <PasswordCustomInput
            password={repeatPassword}
            setPassword={setRepeatPassword}
            setPasswordError={setRepeatPasswordError}
            placeholder="Повторіть пароль"
            registration={true}
          />
          {showError && passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {showError && differentPasswordError ? (
            <Text style={styles.errorText}>{differentPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.btnBlock}>
          <SafeInfoButton handleSubmit={handlePress}>
            Створити акаунт
          </SafeInfoButton>
        </View>
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 52,
    marginHorizontal: 20,
  },
  header: {
    textAlign: 'center',
    marginTop: 52,
    width: '100%',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: 'white',
  },
  content: {
    marginTop: 40,
  },
  btnBlock: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
});
