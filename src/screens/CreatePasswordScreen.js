import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {PasswordCustomInput} from '../components/PasswordCustomInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../config/api';

export const CreatePasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [differentPasswordError, setDifferentPasswordError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const normalizePhone = phone => {
    return phone.replace(/[\s-]/g, '');
  };

  const handlePress = async () => {
    setShowError(true);
    setApiError('');

    // Валідація на клієнті
    if (passwordError.length > 0) {
      return;
    }

    if (password !== repeatPassword) {
      setDifferentPasswordError('Паролі не співпадають.');
      return;
    }

    if (password.length === 0 && repeatPassword.length === 0) {
      setPasswordError('Придумайте пароль. Поля не можуть бути пустими.');
      return;
    }

    // Якщо валідація пройдена - відправляємо на сервер
    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhone(route.params?.number || '');

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/create-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Помилка створення паролю');
      }

      // Пароль успішно створено - очищаємо hasSeenOnboarding для нового користувача
      // щоб після входу він побачив онбординг
      await AsyncStorage.removeItem('hasSeenOnboarding');
      
      // Перехід на екран входу
      setShowError(false);
      navigation.navigate('Login');
    } catch (err) {
      setApiError(
        err.message || 'Помилка підключення до сервера. Перевірте інтернет-з\'єднання.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
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
          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
        </View>

        <View style={styles.btnBlock}>
          <SafeInfoButton
            handleSubmit={handlePress}
            disabled={isLoading}>
            {isLoading ? 'Створення...' : 'Створити акаунт'}
          </SafeInfoButton>
        </View>
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
