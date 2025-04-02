import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {ConnectionMethodModal} from '../components/ConnectionMethodModal';
import {useDispatch} from 'react-redux';
import {createNewClients} from '../redux/action';
import {ChooseConnectionMethod} from '../components/ChooseConnectionMethod';
import {CustomPhoneInput} from '../components/CustomPhoneInput';
import {CustomInput} from '../components/CustomInput';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {CreateConnectionMethod} from '../components/CreateConnectionMethod';

export const CreateClientScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [number, setNumber] = useState('');
  const [targetAndWishes, setTargetAndWishes] = useState('');
  const [stateOfHealth, setStateOfHealth] = useState('');
  const [levelOfPhysical, setLevelOfPhysical] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

  const defaultLinkState = {type: '', link: '', icon: ''};
  const [instagramLink, setInstagramLink] = useState(defaultLinkState);
  const [telegramLink, setTelegramLink] = useState(defaultLinkState);
  const [viberLink, setViberLink] = useState(defaultLinkState);
  const [whatsAppLink, setWhatsAppLink] = useState(defaultLinkState);
  const linksArr = [instagramLink, telegramLink, viberLink, whatsAppLink];
  const [connectionMethods, setConnectionMethods] = useState([]);

  const targetPlaceholder = 'Цілі та основні побажання';
  const healthPlaceholder = 'Стан здоровʼя';
  const levelPlaceholder = 'Рівень фізичної підготовки';
  const notesPlaceholder = 'Замітки';
  const uniqueID = `id-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const clientDataObject = {
    id: uniqueID,
    client: {
      name: name,
      surname: surname,
      number: number,
      link: linksArr,
    },
    clientsCharacteristics: {
      targetAndWishes: targetAndWishes,
      stateOfHealth: stateOfHealth,
      levelOfPhysical: levelOfPhysical,
      notes: notes,
    },
  };

  useEffect(() => {
    if (name.length > 0 && surname.length > 0 && number.length > 0) {
      setIsActiveSubmitBtn(true);
    } else {
      setIsActiveSubmitBtn(false);
    }
  }, [name, surname, number]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleConnectionMethod = (title, icon) => {
    const containElement = connectionMethods.find(el => el.type === title);

    if (connectionMethods.length === 0 || !containElement) {
      setConnectionMethods([
        ...connectionMethods,
        {
          type: title,
          icon: icon,
        },
      ]);
    }
    setIsModalVisible(false);
  };

  const handleRemoveBtn = el => {
    const newConnectionArr = connectionMethods.filter(elem => elem.type !== el);
    setConnectionMethods(newConnectionArr);
  };

  const handleSubmit = () => {
    if (isActiveSubmitBtn) {
      dispatch(createNewClients(clientDataObject));
      navigation.navigate('ClientsProfileScreen', {
        itemData: clientDataObject,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
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
                <ChooseConnectionMethod
                  el={el}
                  key={el.type}
                  setLinks={[
                    setInstagramLink,
                    setViberLink,
                    setTelegramLink,
                    setWhatsAppLink,
                  ]}
                  handleRemoveBtn={handleRemoveBtn}
                />
              ))}
            <CreateConnectionMethod toggleModal={toggleModal} />

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
        </ScrollView>
        <SafeInfoButton
          handleSubmit={handleSubmit}
          disabled={!isActiveSubmitBtn}>
          Створити клієнта
        </SafeInfoButton>
        <ConnectionMethodModal
          visible={isModalVisible}
          hideModal={() => setIsModalVisible(false)}
          handleConnectionMethod={handleConnectionMethod}
        />
      </SafeAreaView>
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
  containerClientInfo: {
    marginTop: 40,
  },
});
