import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {OTPInput} from '../components/OTPInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API_BASE_URL} from '../config/api';

export const RegistrationCodeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const timerRef = useRef(null);

  const [isDisabled, setIsDisabled] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [sendBtnDisabled, setSendBtnDisabled] = useState(true);
  const [code, setCode] = useState(['', '', '', '', '', '']); // 6 цифр
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Перевіряємо, чи всі 6 цифр введені
    const isCodeComplete =
      code.length === 6 &&
      code.every(digit => digit !== '' && digit.trim() !== '');
    setIsDisabled(!isCodeComplete);

    if (errorMessage && isCodeComplete) {
      setErrorMessage('');
    }
  }, [code, errorMessage]);

  useEffect(() => {
    if (timerActive) {
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setSendBtnDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const restartTimer = () => {
    setSeconds(30);
    setTimerActive(true);
    setSendBtnDisabled(true);
  };

  const normalizePhone = phone => {
    return phone.replace(/[\s-]/g, '');
  };

  const handlePress = async () => {
    if (isDisabled || isLoading) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhone(route.params?.number || '');
      const codeString = code.join('');

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          code: codeString,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Невірний код верифікації');
      }

      // Код валідний - перехід на екран створення паролю
      navigation.navigate('CreatePassword', {
        number: route.params?.number,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Невірний код верифікації');
    } finally {
      setIsLoading(false);
    }
  };

  const sendCode = async () => {
    if (sendBtnDisabled) {
      return;
    }

    restartTimer();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const normalizedPhone = normalizePhone(route.params?.number || '');

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка відправки SMS коду');
      }

      // Код відправлено успішно
      // В development режимі код буде в консолі сервера
    } catch (err) {
      setErrorMessage(err.message || 'Помилка відправки SMS коду');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton />
        <Text style={styles.headerTitle}>Введіть код з SMS</Text>
        <Text style={styles.contentTitle}>
          За номером <Text>{route.params.number}</Text> відправлено SMS з кодом
        </Text>

        <OTPInput code={code} setCode={setCode} length={6} />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <SafeInfoButton
          disabled={isDisabled || isLoading}
          handleSubmit={handlePress}>
          {isLoading ? 'Перевірка...' : 'Далі'}
        </SafeInfoButton>

        <View style={styles.sendMessageBlock}>
          {timerActive ? (
            <Text style={styles.title}>
              Надіслати код ще можливо через {seconds} секунд
            </Text>
          ) : (
            <Text style={styles.title}>
              Натисніть кнопку, щоб надіслати код
            </Text>
          )}

          <TouchableOpacity
            style={styles.sendMessageBtn}
            disabled={sendBtnDisabled}
            onPress={sendCode}>
            <Text
              style={[
                styles.title,
                styles.btnTitle,
                sendBtnDisabled && styles.btnDisabled,
              ]}>
              Надіслати SMS з кодом
            </Text>
          </TouchableOpacity>
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
  headerTitle: {
    marginTop: 52,
    width: '100%',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: 'white',
  },
  contentTitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#D1D1D1',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#FF5C5C',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  sendMessageBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 'auto',
    paddingBottom: 30,
  },
  title: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#D1D1D1',
  },
  btnTitle: {
    color: '#3EB1CC',
    fontWeight: '700',
  },
  btnDisabled: {
    color: '#6D6D6D',
  },
  sendMessageBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
