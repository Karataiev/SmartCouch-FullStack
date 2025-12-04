import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {CustomInput} from './CustomInput';
import {CustomPhoneInput} from './CustomPhoneInput';
import {CreateConnectionMethod} from './CreateConnectionMethod';
import {ConnectionMethodModal} from './ConnectionMethodModal';
import {SafeInfoButton} from './SafeInfoButton';
import {ClientEditConnectionMethod} from './ClientEditConnectionMethod';
import {useDispatch, useSelector} from 'react-redux';
import {updateClientsArray} from '../redux/action';
import {selectClientsList} from '../redux/selectors/clientSelectors';

export const ClientEditDataComponent = ({itemData, navigation}) => {
  const client = itemData.client;
  const clientsCharacteristics = itemData.clientsCharacteristics;
  const clientArray = useSelector(selectClientsList);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);
  const [name, setName] = useState(client.name);
  const [surname, setSurname] = useState(client.surname);
  const [number, setNumber] = useState(client.number);
  const [connectionMethods, setConnectionMethods] = useState([]);
  const [prevConnectionMethods, setPrevConnectionMethods] = useState([]);

  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [numberError, setNumberError] = useState('');

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

  useLayoutEffect(() => {
    const newConnectionArr = client.link.filter(el => el.link.length !== 0);
    setConnectionMethods([...newConnectionArr]);
    setPrevConnectionMethods([...newConnectionArr]);
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
    } else if (connectionMethods.length !== prevConnectionMethods.length) {
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

  const handleConnectionMethod = title => {
    const containElement = connectionMethods.find(el => el.type === title);

    if (connectionMethods.length === 0 || !containElement) {
      setConnectionMethods([
        ...connectionMethods,
        {
          type: title,
          link: '',
        },
      ]);
    }
    setIsModalVisible(false);
  };

  const getConnectionMethodLink = (type, value) => {
    const index = connectionMethods.findIndex(el => el.type === type);
    connectionMethods.splice(index, 1, {
      type: type,
      link: value,
    });

    setConnectionMethods(connectionMethods);
  };

  const handleChangeName = text => {
    setName(text);
    if (nameError && text.trim()) {
      setNameError('');
    }
  };

  const handleChangeSurname = text => {
    setSurname(text);
    if (surnameError && text.trim()) {
      setSurnameError('');
    }
  };

  const handleChangeNumber = text => {
    setNumber(text);
    if (numberError && text) {
      setNumberError('');
    }
  };

  const handleSubmit = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("Ім'я не може бути порожнім");
      hasError = true;
    }

    if (!surname.trim()) {
      setSurnameError('Прізвище не може бути порожнім');
      hasError = true;
    }

    if (!number) {
      setNumberError('Номер телефону не може бути порожнім');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const clientDataObject = {
      id: itemData.id,
      client: {
        name: name,
        surname: surname,
        number: number,
        link: connectionMethods,
      },
      clientsCharacteristics: {
        targetAndWishes: targetAndWishes,
        stateOfHealth: stateOfHealth,
        levelOfPhysical: levelOfPhysical,
        notes: notes,
      },
    };

    const updatedClients = clientArray.map(clientItem =>
      clientItem.id === itemData.id ? clientDataObject : clientItem,
    );

    dispatch(updateClientsArray(updatedClients));

    navigation.navigate('ClientsProfile', {
      itemData: clientDataObject,
    });
  };

  return (
    <ScrollView
      scrollEnabled={true}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.container}>
        <View style={styles.formsContainer}>
          <CustomInput
            placeholder={"Ім'я"}
            value={name}
            setValue={handleChangeName}
            errorText={nameError}
          />
          <CustomInput
            placeholder={'Прізвище'}
            value={surname}
            setValue={handleChangeSurname}
            errorText={surnameError}
          />
          <CustomPhoneInput
            inputHeader={true}
            placeholderTextColor={'white'}
            number={number}
            setNumber={handleChangeNumber}
            errorText={numberError}
          />

          {connectionMethods.map(el =>
            el.type.length !== 0 ? (
              <ClientEditConnectionMethod
                el={el}
                key={el.type}
                handleRemoveBtn={handleRemoveBtn}
                setIsActiveSubmitBtn={setIsActiveSubmitBtn}
                getConnectionMethodLink={getConnectionMethodLink}
              />
            ) : null,
          )}
          <CreateConnectionMethod toggleModal={toggleModal} />
          <View style={styles.customInputBlock}>
            <CustomInput
              placeholder={'Цілі та основні побажання'}
              value={targetAndWishes}
              setValue={setTargetAndWishes}
              multiline={true}
            />
            <CustomInput
              placeholder={'Стан здоровʼя (травми / протипоказання)'}
              value={stateOfHealth}
              setValue={setStateOfHealth}
              multiline={true}
            />
            <CustomInput
              placeholder={'Рівень фізичної підготовки'}
              value={levelOfPhysical}
              setValue={setLevelOfPhysical}
              multiline={true}
            />
            <CustomInput
              placeholder={'Замітки'}
              value={notes}
              setValue={setNotes}
              multiline={true}
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
      </SafeAreaView>
    </ScrollView>
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
