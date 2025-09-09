import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ClientsEmptyComponent} from '../components/ClientsEmptyComponent';
import {PinningClientsListComponent} from '../components/PinningClientListComponent';
import {LayoutComponent} from '../components/LayoutComponent';

export const ClientProgramAssignmentScreen = () => {
  const clientsState = useSelector(state => state.clients);
  return (
    <LayoutComponent>
      <View style={styles.container}>
        {clientsState.length === 0 ? (
          <ClientsEmptyComponent isForPinning={true} />
        ) : (
          <PinningClientsListComponent isForPinning={true} />
        )}
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
