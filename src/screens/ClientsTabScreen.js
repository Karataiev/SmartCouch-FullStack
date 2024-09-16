import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ClientsEmptyComponent} from '../components/ClientsEmptyComponent';
import {ClientsComponent} from '../components/ClientsComponent';
import {Container} from '../components/Container';
import {useSelector} from 'react-redux';

export const ClientsTabScreen = ({navigation}) => {
  const clientsState = useSelector(state => state.clientsData);

  return (
    <Container>
      {clientsState ? (
        <ClientsEmptyComponent navigation={navigation} />
      ) : (
        <ClientsComponent />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({});
