import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {SvgCreateService} from '../assets/svgIcons/SvgCreateService';
import {SvgClientsParameters} from '../assets/svgIcons/SvgClientsParameters';
import {SvgProfile} from '../assets/tabIcons/SvgProfile';
import {ConfigModal} from '../components/ConfigModal';
import {CreateProgramModal} from '../components/CreateProgramModal';
import {updateClientsArray} from '../redux/action';
import {ActionButton} from '../components/ActionButton';

export const ClientsProfileScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients);
  const {itemData} = route?.params;

  const [isConfigModalVisible, setConfigModalVisible] = useState(false);
  const [isProgramModalVisible, setProgramModalVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    const client = clients.find(item => item.id === itemData.id);
    setCurrentClient(client || null);
  }, [clients, itemData]);

  const toggleModal = setter => () => setter(prev => !prev);

  const handleProgramPress = () => {
    if (currentClient?.program?.program?.length) {
      navigation.navigate('CurrentProgram', {
        itemData: currentClient.program,
        origin: 'ClientsProfileScreen',
        clientId: currentClient.id,
      });
    } else {
      setProgramModalVisible(true);
    }
  };

  const handleClientParamsPress = () => {
    navigation.navigate('ClientParameters', {clientId: currentClient.id});
  };
  const handleRemoveClient = () => {
    const updatedClients = clients.filter(client => client.id !== itemData.id);
    dispatch(updateClientsArray(updatedClients));
  };

  const navigateToScreen = (screen, origin = '') => {
    const baseParams =
      screen === 'FullClientData'
        ? {itemData, from: origin}
        : {from: origin, clientId: itemData.id};

    navigation.navigate(screen, baseParams);
  };

  if (!currentClient) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Клієнта не знайдено</Text>
      </View>
    );
  }

  const {name, surname, number, link = []} = currentClient.client;

  return (
    <View style={styles.container}>
      {(isConfigModalVisible || isProgramModalVisible) && (
        <View style={styles.shadowOverlay} />
      )}

      <StatusBar backgroundColor="#2E2E2E" />

      <View style={styles.mainInfoContainer}>
        <HeaderWithBackButton
          navigation={navigation}
          configBtn
          goHome
          onPressConfig={toggleModal(setConfigModalVisible)}
        />

        <View style={styles.mainInfoBlock}>
          <Text style={styles.clientName}>
            {name} {surname}
          </Text>
          <Text style={styles.clientNumber}>{number}</Text>

          {!!link.length && (
            <View style={styles.connectionTypesContainer}>
              {link.map((el, idx) =>
                el.link?.length ? (
                  <TouchableOpacity key={idx} style={styles.connectionType}>
                    {el.icon}
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          )}

          <TouchableOpacity style={styles.createNotesBtn}>
            <Text style={styles.createNotesTitle}>Записати на тренування</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.additionalInfoBlock}>
          <ActionButton
            onPress={() => navigateToScreen('FullClientData')}
            icon={<SvgProfile color="white" />}
            title="Про клієнта"
          />
          <ActionButton
            onPress={handleProgramPress}
            icon={<SvgCreateService />}
            title="Програма"
          />
          <ActionButton
            onPress={() => handleClientParamsPress()}
            icon={<SvgClientsParameters />}
            title="Заміри"
          />
        </View>
      </View>

      <Text style={styles.listOfNotesTitle}>У клієнта ще не було записів</Text>

      <ConfigModal
        visible={isConfigModalVisible}
        hideModal={() => setConfigModalVisible(false)}
        handleNavigate={navigateToScreen}
        handleRemove={handleRemoveClient}
      />

      <CreateProgramModal
        visible={isProgramModalVisible}
        hideModal={() => setProgramModalVisible(false)}
        handleNavigate={navigateToScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
  },
  shadowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.6,
  },
  mainInfoContainer: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2E2E2E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  mainInfoBlock: {
    marginTop: 12,
  },
  clientName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    color: 'white',
  },
  clientNumber: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    color: '#FFFF65',
  },
  connectionTypesContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  connectionType: {
    padding: 14,
    backgroundColor: '#3D3D3D',
    borderRadius: 200,
  },
  createNotesBtn: {
    marginTop: 28,
    marginBottom: 21,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#FFFF65',
    borderRadius: 100,
  },
  createNotesTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: 'black',
  },
  additionalInfoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listOfNotesTitle: {
    marginTop: 24,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: '#D1D1D1',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232323',
  },
  emptyText: {
    color: '#D1D1D1',
    fontSize: 16,
  },
});
