import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ClientsEmptyComponent} from '../components/ClientsEmptyComponent';
import {PinningClientsListComponent} from '../components/PinningClientListComponent';

export const PinningProgramScreen = ({navigation, route}) => {
  const clientsState = useSelector(state => state.clients);
  return (
    <View style={styles.container}>
      {clientsState.length === 0 ? (
        <ClientsEmptyComponent
          navigation={navigation}
          isForPinning={true}
          route={route}
        />
      ) : (
        <PinningClientsListComponent
          navigation={navigation}
          isForPinning={true}
          route={route}
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
