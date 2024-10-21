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
import React, {useEffect, useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {SvgConnectionMethod} from '../assets/svgIcons/SvgConnectionMethod';
import {ConnectionMethodModal} from '../components/ConnectionMethodModal';
import {useDispatch, useSelector} from 'react-redux';
import {createNewClients, removeConnectionMethod} from '../redux/action';
import {ChooseConnectionMethod} from '../components/ChooseConnectionMethod';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {TextInputMask} from 'react-native-masked-text';

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
  const placeholderStyle = '#A1A1A1';

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

  const handleFocusNumber = () => {
    if (!number) {
      setNumber('+38 0');
    } else {
      setNumber(number);
    }
  };

  const handleOutNumber = () => {
    if (number.length > 5) {
      setNumber(number);
    } else {
      setNumber('');
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
          <TextInputMask
            type={'custom'}
            options={{
              mask: '+38 0** *** ** **',
            }}
            value={number}
            onChangeText={setNumber}
            onFocus={() => handleFocusNumber()}
            onBlur={() => handleOutNumber()}
            style={styles.input}
            placeholder="Телефон"
            placeholderTextColor="white"
            keyboardType="numeric"
            maxLength={17}
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
            <View>
              <Text style={styles.inputHeader}>{targetPlaceholder}</Text>
              <TextInput
                value={targetAndWishes}
                onChangeText={setTargetAndWishes}
                style={styles.input}
                placeholder={targetPlaceholder}
                placeholderTextColor={placeholderStyle}
              />
            </View>
            <View>
              <Text style={styles.inputHeader}>{healthPlaceholder}</Text>
              <TextInput
                value={stateOfHealth}
                onChangeText={setStateOfHealth}
                style={styles.input}
                placeholder={healthPlaceholder}
                placeholderTextColor={placeholderStyle}
              />
            </View>
            <View>
              <Text style={styles.inputHeader}>{levelPlaceholder}</Text>
              <TextInput
                value={levelOfPhysical}
                onChangeText={setLevelOfPhysical}
                style={styles.input}
                placeholder={levelPlaceholder}
                placeholderTextColor={placeholderStyle}
              />
            </View>
            <View>
              <Text style={styles.inputHeader}>{notesPlaceholder}</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                style={styles.input}
                placeholder={notesPlaceholder}
                placeholderTextColor={placeholderStyle}
              />
            </View>
          </View>
        </View>

        <HideWithKeyboard>
          <TouchableOpacity
            disabled={!isActiveSubmitBtn}
            style={[
              styles.submitBtn,
              !isActiveSubmitBtn && {backgroundColor: '#363636'},
            ]}
            onPress={() => handleSubmit()}>
            <Text
              style={[
                styles.submitBtnTitle,
                !isActiveSubmitBtn && {color: '#A1A1A1'},
              ]}>
              Створити клієнта
            </Text>
          </TouchableOpacity>
        </HideWithKeyboard>

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
  submitBtn: {
    marginTop: 'auto',
    marginBottom: 21,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#FFFF65',
    borderRadius: 100,
  },
  submitBtnTitle: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    color: 'black',
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
