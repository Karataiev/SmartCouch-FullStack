import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import {HeaderForScreens} from './HeaderForScreens';
import {SvgPlus} from '../assets/tabIcons/SvgPlus';

export const ClientsEmptyComponent = ({navigation}) => {
  const createNewClientBtn = () => {
    navigation.navigate('CreateClientScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#232323'} />
      <HeaderForScreens>Клієнти</HeaderForScreens>
      <View style={styles.mainContent}>
        <View style={styles.clientsLogoContainer}>
          <Image
            style={styles.clientsLogo}
            source={require('../assets/pngIcons/emptyClientsPNG.png')}
          />
        </View>
        <Text style={styles.clientsEmptyMainText}>Список клієнтів пустий</Text>
        <Text style={styles.clientsEmptySecondaryText}>
          Створіть нового клієнта прямо зараз
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => createNewClientBtn()}>
          <SvgPlus />
          <Text style={styles.buttonText}>Створити клієнта</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  mainContent: {
    width: '100%',
    marginTop: 80,
    alignItems: 'center',
  },
  clientsLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
    width: 160,
    height: 160,
    borderRadius: 16,
  },
  clientsLogo: {
    maxWidth: 80,
    maxHeight: 80,
  },
  clientsEmptyMainText: {
    paddingTop: 20,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  clientsEmptySecondaryText: {
    paddingTop: 8,
    fontSize: 15,
    lineHeight: 20,
    color: '#A1A1A1',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingVertical: 18,
    width: '100%',
    backgroundColor: '#FFFF65',
    borderRadius: 100,
    gap: 6,
  },
  buttonText: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
