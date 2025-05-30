import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ClientsEmptyComponent} from '../components/ClientsEmptyComponent';
import {ClientsListComponent} from '../components/ClientsListComponent';
import {useSelector} from 'react-redux';

export const ClientsTabScreen = ({navigation}) => {
  const clientsState = useSelector(state => state.clients);
  const createNewClientBtn = () => {
    navigation.navigate('CreateClient', {
      data: {},
    });
  };

  return (
    <View style={styles.container}>
      {clientsState.length === 0 ? (
        <ClientsEmptyComponent navigation={navigation} />
      ) : (
        <ClientsListComponent
          navigation={navigation}
          isForPinning={false}
          onPressAdd={createNewClientBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
  },
});
