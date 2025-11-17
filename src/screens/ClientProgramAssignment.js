import React from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {ClientsEmptyComponent} from '../components/ClientsEmptyComponent';
import {PinningClientsListComponent} from '../components/PinningClientListComponent';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const ClientProgramAssignmentScreen = () => {
  const clientsState = useSelector(state => state.app.clients);
  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        {clientsState.length === 0 ? (
          <ClientsEmptyComponent isForPinning={true} />
        ) : (
          <PinningClientsListComponent isForPinning={true} />
        )}
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
