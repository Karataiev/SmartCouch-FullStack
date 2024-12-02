import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {SvgConnectionMethod} from '../assets/svgIcons/SvgConnectionMethod';
import {ConnectionMethodModal} from '../components/ConnectionMethodModal';
import {useDispatch, useSelector} from 'react-redux';
import {createNewClients, removeConnectionMethod} from '../redux/action';
import {ChooseConnectionMethod} from '../components/ChooseConnectionMethod';
import {CustomPhoneInput} from '../components/CustomPhoneInput';
import {CustomInput} from '../components/CustomInput';
import {SafeInfoButton} from '../components/SafeInfoButton';

export const CreateClientScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [number, setNumber] = useState('');
  const [targetAndWishes, setTargetAndWishes] = useState('');
  const [stateOfHealth, setStateOfHealth] = useState('');
  const [levelOfPhysical, setLevelOfPhysical] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

  const connectionMethods = useSelector(state => state.connectionMethods);
  const dispatch = useDispatch();

  const targetPlaceholder = 'Цілі та основні побажання';
  const healthPlaceholder = 'Стан здоровʼя';
  const levelPlaceholder = 'Рівень фізичної підготовки';
  const notesPlaceholder = 'Замітки';

  useEffect(() => {
    if (name.length > 0 && surname.length > 0 && number.length > 0) {
      setIsActiveSubmitBtn(true);
    } else {
      setIsActiveSubmitBtn(false);
    }
    dispatch(removeConnectionMethod([]));
  }, [name, surname, number]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSubmit = () => {
    if (isActiveSubmitBtn) {
      dispatch(
        createNewClients({
          client: {
            name: name,
            surname: surname,
            number: number,
            link: [...connectionMethods],
          },
          clientsCharacteristics: {
            targetAndWishes: targetAndWishes,
            stateOfHealth: stateOfHealth,
            levelOfPhysical: levelOfPhysical,
            notes: notes,
          },
        }),
      );

      navigation.navigate('ClientsProfileScreen', {
        itemData: {client: {name: name, number: number, surname: surname}},
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.container}>
        <HeaderWithBackButton navigation={navigation}>
          Новий клієнт
        </HeaderWithBackButton>

        <View style={styles.formsContainer}>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Імʼя"
            placeholderTextColor="white"
          />
          <TextInput
            value={surname}
            onChangeText={setSurname}
            style={styles.input}
            placeholder="Прізвище"
            placeholderTextColor="white"
          />
          <CustomPhoneInput
            placeholderTextColor={'white'}
            number={number}
            setNumber={setNumber}
          />
          {connectionMethods &&
            connectionMethods.map(el => (
              <ChooseConnectionMethod el={el} key={el.type} />
            ))}
          <TouchableOpacity
            style={styles.addMethodBtn}
            onPress={() => toggleModal()}>
            <SvgConnectionMethod />
            <Text style={styles.btnTitle}>Додати спосіб звʼязку</Text>
          </TouchableOpacity>

          <View style={styles.containerClientInfo}>
            <CustomInput
              placeholder={targetPlaceholder}
              value={targetAndWishes}
              setValue={setTargetAndWishes}
            />
            <CustomInput
              placeholder={healthPlaceholder}
              value={stateOfHealth}
              setValue={setStateOfHealth}
            />
            <CustomInput
              placeholder={levelPlaceholder}
              value={levelOfPhysical}
              setValue={setLevelOfPhysical}
            />
            <CustomInput
              placeholder={notesPlaceholder}
              value={notes}
              setValue={setNotes}
            />
          </View>
        </View>

        <SafeInfoButton
          handleSubmit={handleSubmit}
          disabled={!isActiveSubmitBtn}>
          Створити клієнта
        </SafeInfoButton>

        <ConnectionMethodModal
          visible={isModalVisible}
          hideModal={() => setIsModalVisible(false)}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  formsContainer: {
    paddingTop: 32,
  },
  input: {
    height: 50,
    width: '100%',
    padding: 8,
    marginBottom: 20,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
  addMethodBtn: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    gap: 4,
  },
  btnTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: 'white',
  },
  connectionInputBlock: {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  connectionInput: {
    display: 'flex',
    height: 50,
    width: '90%',
    paddingLeft: 12,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
  connectionIcon: {
    width: 24,
  },

  containerClientInfo: {
    marginTop: 40,
  },
  inputHeader: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
  },
});
