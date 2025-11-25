import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {LayoutComponent} from '../components/LayoutComponent';
import {CustomPhoneInput} from '../components/CustomPhoneInput';
import {PasswordCustomInput} from '../components/PasswordCustomInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, fetchUserProfile} from '../redux/thunks/authThunk';
import {fetchClients} from '../redux/thunks/clientsThunk';
import {fetchWorkoutPlans} from '../redux/thunks/workoutPlansThunk';

const {width, height} = Dimensions.get('window');

export const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  const normalizePhone = phone => {
    return phone.replace(/[\s-]/g, '');
  };

  const handleLogin = async () => {
    setShowErrors(true);
    setAuthError('');

    if (passwordError || number.length !== 17 || !password) {
      return;
    }

    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhone(number);

      // Використовуємо Redux thunk для логіну
      await dispatch(login({phone: normalizedPhone, password})).unwrap();

      // Після успішного логіну синхронізуємо дані з сервера
      try {
        // Завантажуємо профіль користувача
        await dispatch(fetchUserProfile()).unwrap();

        // Завантажуємо клієнтів
        await dispatch(fetchClients()).unwrap();

        // Завантажуємо плани тренувань
        await dispatch(fetchWorkoutPlans()).unwrap();
      } catch (syncError) {
        console.error('Помилка синхронізації даних:', syncError);
        // Продовжуємо навіть якщо синхронізація не вдалася
      }

      // Перевіряємо, чи користувач вже бачив онбординг
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

      if (hasSeenOnboarding === 'true') {
        navigation.reset({
          index: 0,
          routes: [{name: 'TabBar'}],
        });
      } else {
        // Новий користувач або не бачив онбординг - показуємо онбординг
        navigation.reset({
          index: 0,
          routes: [{name: 'Onboarding'}],
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError(
        err.message ||
          'Невірні дані користувача. Перевірте правильність логіну та паролю',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (number.length === 17 && password.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [number, password, passwordError]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/authorization/loginBackground.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      />

      <LayoutComponent addedStyles={styles.layoutStyles}>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Вхід</Text>

          <CustomPhoneInput
            inputHeader={true}
            number={number}
            setNumber={setNumber}
            style={styles.input}
          />

          <PasswordCustomInput
            password={password}
            setPassword={setPassword}
            setPasswordError={setPasswordError}
            placeholder="Пароль"
          />
          {showErrors && passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {showErrors && !passwordError && authError ? (
            <Text style={styles.errorText}>{authError}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => goToScreen('ForgotPassword')}>
            <Text style={styles.forgotPasswordTitle}>Забули пароль?</Text>
          </TouchableOpacity>

          <SafeInfoButton
            disabled={isDisabled || isLoading}
            handleSubmit={handleLogin}>
            {isLoading ? 'Вхід...' : 'Увійти'}
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

          <View style={styles.goToRegistrationBlock}>
            <Text style={styles.title}>Немає акаунта?</Text>
            <TouchableOpacity
              style={styles.privacyPolicyBtn}
              onPress={() => goToScreen('Registration')}>
              <Text style={[styles.title, styles.btnTitle]}>
                Зареєструватися
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LayoutComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    width: '100%',
    zIndex: 0,
  },
  layoutStyles: {
    position: 'absolute',
    top: 180,
    width: width,
    height: height,
    zIndex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 32,
    paddingHorizontal: 20,
    position: 'relative',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
    width: '100%',
  },
  input: {width: '100%'},
  forgotPassword: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  forgotPasswordTitle: {
    marginBottom: 32,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
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
    paddingBottom: 170,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
});
