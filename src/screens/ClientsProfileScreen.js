import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {SvgCreateService} from '../assets/svgIcons/SvgCreateService';
import {SvgClientsParameters} from '../assets/svgIcons/SvgClientsParameters';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {ConfigModal} from '../components/ConfigModal';
import {SvgProfile} from '../assets/tabIcons/SvgProfile';

export const ClientsProfileScreen = ({route, navigation}) => {
  const clientsArr = useSelector(state => state.clients);
  const connectionMethods = useSelector(state => state.connectionMethods);
  const {itemData} = route.params;

  const [isToggleModal, setIsToggleModal] = useState(false);

  const handleConfigBtn = () => {
    setIsToggleModal(!isToggleModal);
  };

  const handleNavigate = screen => {
    navigation.navigate(screen, {
      itemData: itemData,
    });
  };

  return (
    clientsArr.length !== 0 && (
      <View style={styles.container}>
        <View style={isToggleModal && styles.shadowContainer}>
          <StatusBar backgroundColor={'#2E2E2E'} />
          <View style={styles.mainInfoContainer}>
            <HeaderWithBackButton
              navigation={navigation}
              configBtn={true}
              goHome={true}
              onPressConfig={handleConfigBtn}
            />

            <View style={styles.mainInfoBlock}>
              <Text style={styles.clientName}>
                {itemData.client.name} {itemData.client.surname}
              </Text>
              <Text style={styles.clientNumber}>{itemData.client.number}</Text>

              {connectionMethods && (
                <View style={styles.connectionTypesContainer}>
                  {connectionMethods.map((el, idx) => (
                    <TouchableOpacity style={styles.connectionType} key={idx}>
                      {el.icon}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.createNotesBtn}>
                <Text style={styles.createNotesTitle}>
                  Записати на тренування
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.additionalInfoBlock}>
              <TouchableOpacity
                style={styles.additionalInfoBtn}
                onPress={() => handleNavigate('FullClientData')}>
                <SvgProfile color={'white'} />
                <Text style={styles.additionalInfoTitle}>Про клієнта</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.additionalInfoBtn}>
                <SvgCreateService />
                <Text style={styles.additionalInfoTitle}>Програма</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.additionalInfoBtn}>
                <SvgClientsParameters />
                <Text style={styles.additionalInfoTitle}>Заміри</Text>
              </TouchableOpacity>
            </View>
          </View>

          {false ? (
            <FlatList></FlatList>
          ) : (
            <Text style={styles.listOfNotesTitle}>
              У клієнта ще не було записів
            </Text>
          )}
        </View>

        <ConfigModal
          visible={isToggleModal}
          hideModal={() => setIsToggleModal(false)}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    position: 'relative',
  },
  shadowContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.6,
    width: '100%',
    height: '100%',
  },
  mainInfoContainer: {
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
    display: 'flex',
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
    lineHeight: 20,
    fontWeight: '700',
    color: 'black',
  },
  additionalInfoBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  additionalInfoBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 68,
    width: '30%',
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
  },
  additionalInfoTitle: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 13,
    color: 'white',
  },
  listOfNotesTitle: {
    marginTop: 24,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: '#D1D1D1',
    textAlign: 'center',
  },
});
