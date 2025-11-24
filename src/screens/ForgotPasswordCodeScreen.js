import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {OTPInput} from '../components/OTPInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {SafeAreaView} from 'react-native-safe-area-context';

import {API_BASE_URL} from '../config/api';

export const ForgotPasswordCodeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const timerRef = useRef(null);

  const [isDisabled, setIsDisabled] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [sendBtnDisabled, setSendBtnDisabled] = useState(true);
  const [code, setCode] = useState(['', '', '', '', '', '']); // 6-значний код
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Перевірка, чи всі 6 полів заповнені
    if (code.includes('')) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [code]);

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

      if (data.verified) {
        // Перехід на екран створення нового паролю
        navigation.navigate('ResetPassword', {
          number: route.params?.number,
        });
      } else {
        setErrorMessage('Помилка верифікації коду');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Помилка підключення до сервера. Перевірте інтернет-з\'єднання.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendCode = async () => {
    if (sendBtnDisabled || isResending) {
      return;
    }

    setIsResending(true);
    setErrorMessage('');

    try {
      const normalizedPhone = normalizePhone(route.params?.number || '');

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Помилка відправки SMS коду');
      }

      restartTimer();
    } catch (err) {
      setErrorMessage(
        err.message || 'Помилка відправки SMS. Спробуйте пізніше.',
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton />
        <Text style={styles.headerTitle}>Введіть код з SMS</Text>
        <Text style={styles.contentTitle}>
          За номером <Text style={styles.phoneNumber}>{route.params?.number}</Text> відправлено SMS з кодом
        </Text>

        <OTPInput code={code} setCode={setCode} length={6} />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <SafeInfoButton disabled={isDisabled || isLoading} handleSubmit={handlePress}>
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
            disabled={sendBtnDisabled || isResending}
            onPress={sendCode}>
            <Text
              style={[
                styles.title,
                styles.btnTitle,
                (sendBtnDisabled || isResending) && styles.btnDisabled,
              ]}>
              {isResending ? 'Відправка...' : 'Надіслати SMS з кодом'}
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
  phoneNumber: {
    fontWeight: '700',
    color: 'white',
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

