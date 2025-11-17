import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {SvgCreateService} from '../assets/svgIcons/SvgCreateService';
import {SvgClientsParameters} from '../assets/svgIcons/SvgClientsParameters';
import {SvgProfile} from '../assets/tabIcons/SvgProfile';
import {ConfigModal} from '../components/ConfigModal';
import {CreateProgramModal} from '../components/CreateProgramModal';
import {getPinningClientId, updateClientsArray} from '../redux/action';
import {ActionButton} from '../components/ActionButton';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ClientTrainingList} from '../components/ClientTrainingList';

export const ClientsProfileScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.app.clients);
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

  const handlePlaningBtn = (screen, origin) => {
    dispatch(getPinningClientId(itemData.id));
    navigateToScreen(screen, origin);
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
    <LayoutComponent>
      <>
        <SafeAreaView style={styles.container}>
          {(isConfigModalVisible || isProgramModalVisible) && (
            <View style={styles.shadowOverlay} />
          )}

          <View style={styles.mainInfoContainer}>
            <HeaderWithBackButton
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
                      <TouchableOpacity
                        key={idx + 1}
                        style={styles.connectionType}>
                        {el.icon}
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>
              )}

              <TouchableOpacity
                style={styles.createNotesBtn}
                onPress={() =>
                  handlePlaningBtn('TrainingPlanning', 'clientProfile')
                }>
                <Text style={styles.createNotesTitle}>
                  Запланувати тренування
                </Text>
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
                onPress={handleClientParamsPress}
                icon={<SvgClientsParameters />}
                title="Заміри"
              />
            </View>
          </View>

          <ClientTrainingList clientId={currentClient.id} />
        </SafeAreaView>

        <ConfigModal
          visible={isConfigModalVisible}
          hideModal={() => setConfigModalVisible(false)}
          handleNavigate={navigateToScreen}
          handleRemove={handleRemoveClient}
        />

        <CreateProgramModal
          visible={isProgramModalVisible}
          hideModal={() => setProgramModalVisible(false)}
          handleNavigate={(screen, origin) =>
            navigation.navigate(screen, {
              origin,
              clientId: currentClient.id,
            })
          }
        />
      </>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'transparent',
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
    color: 'white',
  },
  connectionTypesContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  connectionType: {
    padding: 14,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 200,
  },
  createNotesBtn: {
    marginTop: 28,
    marginBottom: 21,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'white',
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
