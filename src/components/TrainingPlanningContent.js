import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TrainingPlanningItemLayout} from './TrainingPlanningItemLayout';
import {TrainingTypeCheckbox} from './TrainingTypeCheckbox';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {ClientListItem} from './ClientListItem';

const COLORS = {
  personal: '#00704F',
  group: '#4195B9',
};

export const TrainingPlanningContent = ({setPlanningTrainingData}) => {
  const clientId = useSelector(state => state.app.pinningClientId);
  const clientsArr = useSelector(state => state.app.clients);

  const navigation = useNavigation();

  const [selectedType, setSelectedType] = useState('personal');
  const [trainingName, setTrainingName] = useState('');
  const [location, setLocation] = useState('');
  const [pinnedClient, setPinnedClient] = useState(null);

  const placeholderName = 'Split/Trx/Functional etc.';
  const placeholderLocation = 'Вкажіть локацію';
  const uniqueID = `id-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`;

  useEffect(() => {
    setPlanningTrainingData({
      trainingName: trainingName,
      trainingType: selectedType,
      client: pinnedClient,
      location: location,
    });
  }, [selectedType, trainingName, location, pinnedClient]);

  useEffect(() => {
    if (clientId.length !== 0) {
      const foundClient = clientsArr.find(item => item.id === clientId);
      setPinnedClient(foundClient);
    }
  }, [clientId, clientsArr]);

  const handleGetClient = () => {
    navigation.navigate('ClientProgramAssignment', {
      id: uniqueID,
      origin: 'TrainingPlanningContent',
    });
  };

  const handlePressClientItem = item => {
    navigation.navigate('ClientsProfile', {itemData: pinnedClient});
  };

  return (
    <View style={styles.container}>
      <TrainingPlanningItemLayout title="Назва тренування">
        <TextInput
          value={trainingName}
          onChangeText={setTrainingName}
          style={styles.input}
          placeholder={placeholderName}
          placeholderTextColor={'#A1A1A1'}
          inputMode={'text'}
        />
      </TrainingPlanningItemLayout>

      <TrainingPlanningItemLayout title="Тип тренування">
        <View style={styles.serviceTypeBlock}>
          <TrainingTypeCheckbox
            type="personal"
            title="ПЕРСОНАЛЬНЕ"
            isSelected={selectedType === 'personal'}
            onSelect={() => setSelectedType('personal')}
            color={COLORS.personal}
            style={styles.personalItem}
          />
          <TrainingTypeCheckbox
            type="group"
            title="ГРУПОВЕ"
            isSelected={selectedType === 'group'}
            onSelect={() => setSelectedType('group')}
            color={COLORS.group}
          />
        </View>
      </TrainingPlanningItemLayout>

      <TrainingPlanningItemLayout title="Клієнт">
        {pinnedClient ? (
          <ClientListItem
            item={pinnedClient}
            handlePress={handlePressClientItem}
          />
        ) : (
          <TouchableOpacity
            style={styles.getClientBtn}
            onPress={handleGetClient}>
            <Text style={styles.getClientTitle}>Обрати клієнта</Text>
            <SvgArrowRight />
          </TouchableOpacity>
        )}
      </TrainingPlanningItemLayout>

      <TrainingPlanningItemLayout title="Локація">
        <TextInput
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          placeholder={placeholderLocation}
          placeholderTextColor={'#A1A1A1'}
          inputMode={'text'}
        />
      </TrainingPlanningItemLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  serviceTypeBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  personalItem: {
    marginRight: 15,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingLeft: 9,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    color: 'white',
  },
  getClientBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: '#232929',
  },
  getClientTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: '#A1A1A1',
  },
});
