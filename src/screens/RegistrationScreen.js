import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {CustomPhoneInput} from '../components/CustomPhoneInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL} from '../config/api';

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
      const url = `${API_BASE_URL}/api/v1/auth/register`;

      console.log('Registration request to:', url);
      console.log('Phone:', normalizedPhone);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Перевіряємо Content-Type перед парсингом JSON
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          console.log('Response text:', text);
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error(
            'Сервер повернув некоректну відповідь. Перевірте, чи сервер запущений.',
          );
        }
      } else {
        // Якщо відповідь не JSON, читаємо як текст
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(
          `Сервер повернув некоректну відповідь (статус: ${response.status}). Перевірте налаштування API.`,
        );
      }

      if (!response.ok) {
        // Спеціальна обробка помилки rate limiting (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const message = retryAfter
            ? `Забагато спроб реєстрації. Спробуйте через ${retryAfter} секунд.`
            : data.message ||
              'Забагато спроб реєстрації. Спробуйте через годину.';
          throw new Error(message);
        }
        throw new Error(data.message || 'Помилка відправки SMS коду');
      }

      if (data.success) {
        // Перехід на екран введення коду
        navigation.navigate('RegistrationCode', {
          number: number,
          code: data.code, // Код для тестування (тільки в development)
        });
      } else {
        setError(data.message || 'Помилка відправки SMS коду');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message.includes('JSON')) {
        setError(
          'Помилка підключення до сервера. Перевірте, чи сервер запущений на ' +
            API_BASE_URL,
        );
      } else {
        setError(
          err.message ||
            "Помилка підключення до сервера. Перевірте інтернет-з'єднання.",
        );
      }
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
