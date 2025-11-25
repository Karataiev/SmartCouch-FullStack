import {ScrollView, StyleSheet, View} from 'react-native';
import {CustomInput} from './CustomInput';
import {CustomPhoneInput} from './CustomPhoneInput';
import React, {useEffect, useState} from 'react';
import {SafeInfoButton} from './SafeInfoButton';
import {saveUserData} from '../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../config/api';

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

        const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const userProfile = data.data;
            // Оновлюємо локальний стан з даними з сервера
            setName(userProfile.name || '');
            setSurname(userProfile.surname || '');
            setNumber(userProfile.phone || ''); // Номер телефону з сервера
            setEmail(userProfile.email || '');
            setBirthday(userProfile.birthday || '');
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
        } else {
          // Якщо запит не вдався, спробуємо завантажити номер телефону з AsyncStorage
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
  }, [name, surname, number, email, birthday, experience, city]);

  const handleSubmit = async () => {
    if (isActiveSubmitBtn) {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('Токен доступу не знайдено');
          return;
        }

        // Форматування дати для сервера (якщо потрібно)
        let formattedBirthday = birthday;
        if (birthday) {
          // Якщо дата вже в правильному форматі, залишаємо як є
          // Якщо потрібно конвертувати, додайте логіку тут
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: name || '',
            surname: surname || '',
            email: email || '',
            birthday: formattedBirthday || undefined,
            experience: experience || '',
            city: city || '',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
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
        } else {
          const errorData = await response.json();
          console.error('Помилка оновлення профілю:', errorData.message);
        }
      } catch (error) {
        console.error('Помилка збереження даних:', error);
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
        <CustomPhoneInput
          inputHeader={true}
          placeholderTextColor={'#A1A1A1'}
          number={number}
          setNumber={setNumber}
        />
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          inputType="email"
        />
        <CustomInput
          placeholder="Дата народження"
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
  },
});
