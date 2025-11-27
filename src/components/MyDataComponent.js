import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {CustomInput} from './CustomInput';
import React, {useEffect, useState} from 'react';
import {SafeInfoButton} from './SafeInfoButton';
import {saveUserData} from '../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserProfile, updateUserProfile} from '../redux/thunks/authThunk';
import {parseDateToISO, formatISOToDisplay} from '../redux/utils/dateUtils';

export const MyDataComponent = ({navigation}) => {
  const userData = useSelector(state => state.app.userData);
  const [name, setName] = useState(userData.name || '');
  const [surname, setSurname] = useState(userData.surname || '');
  const [number, setNumber] = useState(userData.number || '');
  const [email, setEmail] = useState(userData.email || '');
  const [birthday, setBirthday] = useState(userData.birthday || '');
  const [experience, setExperience] = useState(userData.experience || '');
  const [city, setCity] = useState(userData.city || '');
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');

  const dispatch = useDispatch();

  // Завантаження даних користувача з сервера при монтуванні компонента
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          // Якщо токену немає, спробуємо завантажити номер телефону з AsyncStorage
          const savedPhone = await AsyncStorage.getItem('userPhone');
          if (savedPhone && !number) {
            setNumber(savedPhone);
            dispatch(
              saveUserData({
                ...userData,
                number: savedPhone,
              }),
            );
          }
          setIsLoadingUserData(false);
          return;
        }

        // Використовуємо Redux thunk для завантаження профілю
        const userProfile = await dispatch(fetchUserProfile()).unwrap();

        if (userProfile) {
          // Оновлюємо локальний стан з даними з сервера
          setName(userProfile.name || '');
          setSurname(userProfile.surname || '');
          setNumber(userProfile.phone || ''); // Номер телефону з сервера
          setEmail(userProfile.email || '');
          // Конвертуємо ISO дату в зручний формат для відображення
          const displayBirthday = userProfile.birthday
            ? formatISOToDisplay(userProfile.birthday)
            : '';
          setBirthday(displayBirthday);
          setExperience(userProfile.experience || '');
          setCity(userProfile.city || '');

          // Зберігаємо дані в Redux store
          dispatch(
            saveUserData({
              name: userProfile.name || '',
              surname: userProfile.surname || '',
              number: userProfile.phone || '', // Номер телефону з сервера
              email: userProfile.email || '',
              birthday: userProfile.birthday || '',
              experience: userProfile.experience || '',
              city: userProfile.city || '',
            }),
          );
        }
      } catch (error) {
        console.error('Помилка завантаження даних користувача:', error);
        // У разі помилки спробуємо завантажити номер телефону з AsyncStorage
        try {
          const savedPhone = await AsyncStorage.getItem('userPhone');
          if (savedPhone && !number) {
            setNumber(savedPhone);
            dispatch(
              saveUserData({
                ...userData,
                number: savedPhone,
              }),
            );
          }
        } catch (storageError) {
          console.error('Помилка завантаження з AsyncStorage:', storageError);
        }
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkChanges = () => {
    if (
      userData.name !== name ||
      userData.surname !== surname ||
      userData.number !== number ||
      userData.email !== email ||
      userData.birthday !== birthday ||
      userData.experience !== experience ||
      userData.city !== city
    ) {
      setIsActiveSubmitBtn(true);
    } else {
      setIsActiveSubmitBtn(false);
    }
  };

  useEffect(() => {
    checkChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, surname, number, email, birthday, experience, city]);

  // Валідація email
  const validateEmail = emailValue => {
    if (!emailValue || emailValue.trim() === '') {
      setEmailError('');
      return true;
    }

    const trimmedEmail = emailValue.trim();

    // Покращена валідація email:
    // - Локальна частина (до @): літери, цифри, крапки, дефіси, підкреслення, плюси
    // - Доменна частина: літери, цифри, дефіси, крапки
    // - TLD (домен верхнього рівня): 2-6 символів, тільки літери
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Введено невірний формат email. Приклад: test@gmail.com');
      return false;
    }

    // Додаткова перевірка: доменна частина не може починатися або закінчуватися крапкою або дефісом
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
      setEmailError('Введено невірний формат email. Приклад: test@gmail.com');
      return false;
    }

    const domain = parts[1];
    if (
      domain.startsWith('.') ||
      domain.startsWith('-') ||
      domain.endsWith('.') ||
      domain.endsWith('-')
    ) {
      setEmailError('Введено невірний формат email. Приклад: test@gmail.com');
      return false;
    }

    // Перевірка, що TLD (після останньої крапки) містить тільки літери
    const tld = domain.split('.').pop();
    if (!tld || !/^[a-zA-Z]{2,6}$/.test(tld)) {
      setEmailError('Введено невірний формат email. Приклад: test@gmail.com');
      return false;
    }

    setEmailError('');
    return true;
  };

  // Валідація дати народження
  const validateBirthday = birthdayValue => {
    if (!birthdayValue || birthdayValue.trim() === '') {
      setBirthdayError('');
      return true;
    }

    const trimmed = birthdayValue.trim();

    // Перевірка формату: дозволяємо dd.MM.yyyy, dd.MM.yy, dd/MM/yyyy, dd/MM/yy, dd-MM-yyyy, dd-MM-yy
    const dateFormats = [
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // dd.MM.yyyy
      /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/, // dd.MM.yy
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // dd/MM/yyyy
      /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, // dd/MM/yy
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // dd-MM-yyyy
      /^(\d{1,2})-(\d{1,2})-(\d{2})$/, // dd-MM-yy
    ];

    let isValidFormat = false;
    let day, month, year;

    for (const format of dateFormats) {
      const match = trimmed.match(format);
      if (match) {
        isValidFormat = true;
        day = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        year = parseInt(match[3], 10);

        // Якщо рік у форматі yy, конвертуємо в yyyy
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }

        // Валідація днів та місяців
        if (day < 1 || day > 31 || month < 1 || month > 12) {
          isValidFormat = false;
          continue;
        }

        // Створюємо дату та перевіряємо валідність
        const date = new Date(year, month - 1, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          setBirthdayError('');
          return true;
        } else {
          isValidFormat = false;
        }
      }
    }

    // Якщо не знайдено жодного валідного формату
    if (!isValidFormat) {
      setBirthdayError('Дата введена у невірному форматі. Приклад: дд.мм.рррр');
      return false;
    }

    setBirthdayError('');
    return true;
  };

  const handleSubmit = async () => {
    if (isActiveSubmitBtn) {
      // Валідація email перед відправкою
      if (!validateEmail(email)) {
        return;
      }

      // Валідація дати народження перед відправкою
      if (birthday && birthday.trim() && !validateBirthday(birthday)) {
        return;
      }

      try {
        // Форматування дати для сервера - парсимо різні формати та конвертуємо в ISO
        let formattedBirthday = birthday;
        if (birthday && birthday.trim()) {
          const parsedDate = parseDateToISO(birthday);
          if (parsedDate) {
            // Конвертуємо в ISO datetime формат для сервера
            formattedBirthday = `${parsedDate}T00:00:00.000Z`;
          } else {
            // Якщо не вдалося розпарсити, залишаємо як є (сервер спробує розпарсити)
            formattedBirthday = birthday.trim();
          }
        }

        // Використовуємо Redux thunk для оновлення профілю
        const updatedProfile = await dispatch(
          updateUserProfile({
            name: name || '',
            surname: surname || '',
            email: email || '',
            birthday: formattedBirthday || undefined,
            experience: experience || '',
            city: city || '',
          }),
        ).unwrap();

        if (updatedProfile) {
          // Зберігаємо дані в Redux store (номер телефону не змінюється через API)
          dispatch(
            saveUserData({
              name: name,
              surname: surname,
              number: number, // Номер телефону залишається незмінним
              email: email,
              birthday: birthday,
              experience: experience,
              city: city,
            }),
          );

          navigation.goBack();
        }
      } catch (error) {
        // Обробка помилок валідації з сервера
        const errorMessage =
          error.message || (error.data && error.data.message) || '';
        if (
          errorMessage.toLowerCase().includes('email') ||
          errorMessage.toLowerCase().includes('невірний формат email')
        ) {
          setEmailError(
            'Введено невірний формат email. Приклад: test@gmail.com',
          );
        } else {
          // Якщо помилка не пов'язана з email, все одно перевіряємо email на клієнті
          validateEmail(email);
        }
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <CustomInput placeholder="Імʼя" value={name} setValue={setName} />
        <CustomInput
          placeholder="Прізвище"
          value={surname}
          setValue={setSurname}
        />
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneHeader}>Телефон</Text>
          <Text style={styles.phoneValue}>{number || 'Не вказано'}</Text>
        </View>
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          inputType="email"
        />
        <CustomInput
          placeholder="Дата народження (дд.мм.рррр)"
          value={birthday}
          setValue={setBirthday}
          inputType="numeric"
        />
        <CustomInput
          placeholder="Стаж тренувань (років)"
          value={experience}
          setValue={setExperience}
          inputType="numeric"
        />
        <CustomInput placeholder="Місто" value={city} setValue={setCity} />
      </ScrollView>

      {emailError || birthdayError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{emailError || birthdayError}</Text>
        </View>
      ) : null}

      <SafeInfoButton handleSubmit={handleSubmit} disabled={!isActiveSubmitBtn}>
        Зберегти
      </SafeInfoButton>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  errorContainer: {
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  phoneContainer: {
    marginBottom: 20,
  },
  phoneHeader: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
    marginBottom: 4,
  },
  phoneValue: {
    height: 50,
    paddingHorizontal: 8,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    color: '#A1A1A1',
    fontSize: 17,
    lineHeight: 22,
    paddingTop: 14,
  },
});
