import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {OTPInput} from '../components/OTPInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const mockedCode = ['1', '2', '3', '4'];

export const RegistrationCodeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const timerRef = useRef(null);

  const [isDisabled, setIsDisabled] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [sendBtnDisabled, setSendBtnDisabled] = useState(true);
  const [code, setCode] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (code.includes('')) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    if (code.join('') === mockedCode.join('')) {
      setErrorMessage('');
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

  const handlePress = () => {
    if (code.join('') === mockedCode.join('')) {
      setErrorMessage('');
      navigation.navigate('CreatePassword');
    } else {
      setErrorMessage('Введено невірний код');
    }
  };

  const sendCode = () => {
    restartTimer();
    // API виклик надсилання коду
  };

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton />
        <Text style={styles.headerTitle}>Введіть код з SMS</Text>
        <Text style={styles.contentTitle}>
          За номером <Text>{route.params.number}</Text> відправлено SMS з кодом
        </Text>

        <OTPInput code={code} setCode={setCode} />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <SafeInfoButton disabled={isDisabled} handleSubmit={handlePress}>
          Далі
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
