import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ClientsEmptyComponent} from '../components/ClientsEmptyComponent';
import {ClientsListComponent} from '../components/ClientsListComponent';
import {useSelector} from 'react-redux';
import {LayoutComponent} from '../components/LayoutComponent';

export const ClientsTabScreen = ({navigation}) => {
  const clientsState = useSelector(state => state.clients);
  const createNewClientBtn = () => {
    navigation.navigate('CreateClient', {
      data: {},
    });
  };

  return (
    <LayoutComponent>
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
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
});
