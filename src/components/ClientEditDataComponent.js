import {useEffect, useLayoutEffect, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {CustomInput} from './CustomInput';
import {CustomPhoneInput} from './CustomPhoneInput';
import {CreateConnectionMethod} from './CreateConnectionMethod';
import {ConnectionMethodModal} from './ConnectionMethodModal';
import {SafeInfoButton} from './SafeInfoButton';
import {ClientEditConnectionMethod} from './ClientEditConnectionMethod';

export const ClientEditDataComponent = ({itemData}) => {
  const client = itemData.client;
  const clientsCharacteristics = itemData.clientsCharacteristics;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);
  const [name, setName] = useState(client.name);
  const [surname, setSurname] = useState(client.surname);
  const [number, setNumber] = useState(client.number);
  const [connectionMethods, setConnectionMethods] = useState([]);
  const [targetAndWishes, setTargetAndWishes] = useState(
    clientsCharacteristics.targetAndWishes,
  );
  const [stateOfHealth, setStateOfHealth] = useState(
    clientsCharacteristics.stateOfHealth,
  );
  const [levelOfPhysical, setLevelOfPhysical] = useState(
    clientsCharacteristics.levelOfPhysical,
  );
  const [notes, setNotes] = useState(clientsCharacteristics.notes);

  const checkConnectionMethodArraysChanges = connectionMethods => {
    if (connectionMethods.length !== client.link.length) {
      return true;
    } else {
      for (let i = 0; i < connectionMethods.length; i++) {
        if (connectionMethods[i].link !== client.link[i].link) {
          return true;
        }
      }
      return false;
    }
  };

  useLayoutEffect(() => {
    const newConnectionArr = client.link.filter(el => el.link.length !== 0);
    setConnectionMethods([...newConnectionArr]);
  }, []);

  useEffect(() => {
    if (
      client.name !== name ||
      client.surname !== surname ||
      client.number !== number
    ) {
      setIsActiveSubmitBtn(true);
    } else if (
      clientsCharacteristics.targetAndWishes !== targetAndWishes ||
      clientsCharacteristics.stateOfHealth !== stateOfHealth ||
      clientsCharacteristics.levelOfPhysical !== levelOfPhysical ||
      clientsCharacteristics.notes !== notes
    ) {
      setIsActiveSubmitBtn(true);
    } else if (checkConnectionMethodArraysChanges(connectionMethods)) {
      setIsActiveSubmitBtn(true);
    } else {
      setIsActiveSubmitBtn(false);
    }
  }, [
    name,
    surname,
    number,
    targetAndWishes,
    stateOfHealth,
    levelOfPhysical,
    notes,
    connectionMethods,
  ]);

  const handleRemoveBtn = el => {
    const newConnectionArr = connectionMethods.filter(elem => elem.type !== el);
    setConnectionMethods(newConnectionArr);
  };

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

  const handleSubmit = () => {
    console.log('---------------', connectionMethods);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.container}>
        <View style={styles.formsContainer}>
          <CustomInput placeholder={"Ім'я"} value={name} setValue={setName} />
          <CustomInput
            placeholder={'Прізвище'}
            value={surname}
            setValue={setSurname}
          />
          <CustomPhoneInput
            inputHeader={true}
            placeholderTextColor={'white'}
            number={number}
            setNumber={setNumber}
          />

          {connectionMethods.map(el =>
            el.type.length !== 0 ? (
              <ClientEditConnectionMethod
                el={el}
                key={el.type}
                handleRemoveBtn={handleRemoveBtn}
              />
            ) : null,
          )}
          <CreateConnectionMethod toggleModal={toggleModal} />
          <View style={styles.customInputBlock}>
            <CustomInput
              placeholder={'Цілі та основні побажання'}
              value={targetAndWishes}
              setValue={setTargetAndWishes}
            />
            <CustomInput
              placeholder={'Стан здоровʼя (травми / протипоказання)'}
              value={stateOfHealth}
              setValue={setStateOfHealth}
            />
            <CustomInput
              placeholder={'Рівень фізичної підготовки'}
              value={levelOfPhysical}
              setValue={setLevelOfPhysical}
            />
            <CustomInput
              placeholder={'Замітки'}
              value={notes}
              setValue={setNotes}
            />
          </View>
        </View>
        <SafeInfoButton
          handleSubmit={handleSubmit}
          disabled={!isActiveSubmitBtn}>
          Зберегти
        </SafeInfoButton>

        <ConnectionMethodModal
          visible={isModalVisible}
          hideModal={() => setIsModalVisible(false)}
          handleConnectionMethod={handleConnectionMethod}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
  inputHeader: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
  },
  customInputBlock: {
    marginTop: 40,
  },
});
