import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {CustomPhoneInput} from '../components/CustomPhoneInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useNavigation} from '@react-navigation/native';
import {authService} from '../services/api';

export const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (number.length !== 17) {
      setIsActiveSubmitBtn(false);
    } else {
      setIsActiveSubmitBtn(true);
    }
  }, [number]);

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  const normalizePhone = phone => {
    // Видаляємо пробіли та дефіси для відправки на сервер
    return phone.replace(/[\s-]/g, '');
  };

  const handleSubmit = async () => {
    if (!isActiveSubmitBtn || isLoading) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhone(number);

      const response = await authService.register(normalizedPhone);

      if (response.success) {
        // Перехід на екран введення коду
        navigation.navigate('RegistrationCode', {
          number: number,
          code: response.code, // Код для тестування (тільки в development)
        });
      } else {
        setError(response.message || 'Помилка відправки SMS коду');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.message ||
          "Помилка підключення до сервера. Перевірте інтернет-з'єднання.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutComponent>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Вітаємо у SmartCoach</Text>
        <Text style={styles.contentTitle}>
          Введіть ваш номер телефону та ми відравимо вам SMS з кодом
        </Text>
        <View style={styles.contentBlock}>
          <CustomPhoneInput
            inputHeader={true}
            placeholderTextColor={'white'}
            number={number}
            setNumber={setNumber}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <SafeInfoButton
            handleSubmit={handleSubmit}
            disabled={!isActiveSubmitBtn || isLoading}>
            {isLoading ? 'Відправка...' : 'Отримати SMS'}
          </SafeInfoButton>

          <View style={styles.privacyPolicyBlock}>
            <Text style={styles.title}>
              Натискаючи кнопку «Увійти», ви приймаєте умови
            </Text>
            <TouchableOpacity style={styles.privacyPolicyBtn}>
              <Text style={[styles.title, styles.btnTitle]}>
                Політики конфіденційності
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.goToRegistrationBlock}>
          <Text style={styles.title}>Зареєстровані?</Text>
          <TouchableOpacity
            style={styles.privacyPolicyBtn}
            onPress={() => goToScreen('Login')}>
            <Text style={[styles.title, styles.btnTitle]}>Увійти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 84,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
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
  contentBlock: {
    width: '100%',
    marginTop: 40,
  },
  privacyPolicyBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#D1D1D1',
  },
  btnTitle: {color: '#3EB1CC', fontWeight: '700'},
  privacyPolicyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  goToRegistrationBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 'auto',
    paddingBottom: 30,
  },
  errorText: {
    color: '#FF5C5C',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});
