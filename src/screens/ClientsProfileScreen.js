import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {SvgClientProgram} from '../assets/svgIcons/SvgClientProgram';
import {SvgClientsParameters} from '../assets/svgIcons/SvgClientsParameters';
import {useSelector} from 'react-redux';

export const ClientsProfileScreen = ({navigation}) => {
  const clientsArr = useSelector(state => state.clients);
  const currentClient = clientsArr[clientsArr.length - 1];

  return (
    clientsArr.length !== 0 && (
      <View style={styles.container}>
        <View style={styles.mainInfoContainer}>
          <HeaderWithBackButton
            navigation={navigation}
            configBtn={true}
            editClientInfo={true}
          />

          <View style={styles.mainInfoBlock}>
            <Text style={styles.clientName}>{currentClient.client.name}</Text>
            <Text style={styles.clientNumber}>
              {currentClient.client.number}
            </Text>

            <TouchableOpacity style={styles.createNotesBtn}>
              <Text style={styles.createNotesTitle}>
                Записати на тренування
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.additionalInfoBlock}>
            <TouchableOpacity style={styles.additionalInfoBtn}>
              <SvgClientProgram />
              <Text style={styles.additionalInfoTitle}>Інформація</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalInfoBtn}>
              <SvgClientsParameters />
              <Text style={styles.additionalInfoTitle}>Заміри</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalInfoBtn}>
              <SvgClientProgram />
              <Text style={styles.additionalInfoTitle}>Програма</Text>
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
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
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
