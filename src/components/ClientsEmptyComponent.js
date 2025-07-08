import React from 'react';
import {StyleSheet, Text, View, Image, StatusBar} from 'react-native';
import {HeaderForScreens} from './HeaderForScreens';
import {HeaderWithBackButton} from './HeaderWithBackButton';
import {useNavigation, useRoute} from '@react-navigation/native';

export const ClientsEmptyComponent = ({isForPinning}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const createNewClientBtn = () => {
    if (isForPinning) {
      navigation.navigate('CreateClient', {
        data: {isForPinning: isForPinning, routeData: route},
      });
    } else {
      navigation.navigate('CreateClient', {
        data: {},
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#232323'} />
      {isForPinning ? (
        <HeaderWithBackButton addBtn={true} onPressAdd={createNewClientBtn}>
          Клієнти
        </HeaderWithBackButton>
      ) : (
        <HeaderForScreens addBtn={true} onPressAdd={createNewClientBtn}>
          Клієнти
        </HeaderForScreens>
      )}

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
});
