import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {LayoutComponent} from '../components/LayoutComponent';
import {CustomPhoneInput} from '../components/CustomPhoneInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useNavigation} from '@react-navigation/native';

export const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

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

  const handleSubmit = () => {
    navigation.navigate('RegistrationCode', {
      number: number,
    });
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
          <SafeInfoButton
            handleSubmit={handleSubmit}
            disabled={!isActiveSubmitBtn}>
            Отримати SMS
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
});
