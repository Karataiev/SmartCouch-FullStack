import {ScrollView, StyleSheet, View} from 'react-native';
import {CustomInput} from './CustomInput';
import {CustomPhoneInput} from './CustomPhoneInput';
import React, {useEffect, useState} from 'react';
import {SafeInfoButton} from './SafeInfoButton';
import {safeUserData} from '../redux/action';
import {useDispatch, useSelector} from 'react-redux';

export const MyDataComponent = ({navigation}) => {
  const userData = useSelector(state => state.app.userData);
  const [name, setName] = useState(userData.name);
  const [surname, setSurname] = useState(userData.surname);
  const [number, setNumber] = useState(userData.number);
  const [email, setEmail] = useState(userData.email);
  const [birthday, setBirthday] = useState(userData.birthday);
  const [experience, setExperience] = useState(userData.experience);
  const [city, setCity] = useState(userData.city);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

  const dispatch = useDispatch();

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

  const handleSubmit = () => {
    if (isActiveSubmitBtn) {
      dispatch(
        safeUserData({
          name: name,
          surname: surname,
          number: number,
          email: email,
          birthday: birthday,
          experience: experience,
          city: city,
        }),
      );

      navigation.goBack();
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
