import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ClientListItem} from './ClientListItem';
import {ClientListPinningItem} from './ClientListPinningItem';
import {SafeInfoButton} from './SafeInfoButton';
import {setPinningClientId, updateClientProgram} from '../redux/action';
import {useNavigation, useRoute} from '@react-navigation/native';
import {selectClientsList} from '../redux/selectors/clientSelectors';
import {useToast} from '../castomHooks/useToast';

export const ClientList = ({items, pinningClient}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const clients = useSelector(selectClientsList);
  const {showToast} = useToast();

  const [pinnedClientIds, setPinnedClientIds] = useState([]);

  const letters = useMemo(() => {
    const firstLetters = items
      .filter(item => item?.client?.surname)
      .map(item => item.client.surname.charAt(0).toUpperCase());
    return [...new Set(firstLetters)].sort();
  }, [items]);

  const handlePressClientItem = item => {
    navigation.navigate('ClientsProfile', {itemData: item});
  };

  const handlePressPinningClientItem = (item, setIsChecked, isChecked) => {
    setIsChecked(!isChecked);
    setPinnedClientIds(prev =>
      isChecked ? prev.filter(id => id !== item.id) : [...prev, item.id],
    );
  };

  const safePinnedProgram = () => {
    const routeData = route.params;

    if (routeData?.origin === 'TrainingPlanningContent') {
      dispatch(setPinningClientId(...pinnedClientIds));
    } else {
      clients.map(client => {
        if (pinnedClientIds.includes(client.id)) {
          const clientProgram = {
            id: routeData.itemData.id,
            title: routeData.itemData.title,
            program: routeData.itemData.program,
          };

          dispatch(
            updateClientProgram({
              clientId: client.id,
              programInfo: clientProgram,
            }),
          );

          return {
            ...client,
            program: clientProgram,
          };
        }
        return client;
      });
      showToast('Програму закріплено успішно');
    }
    navigation.goBack();
  };

  const renderClientListItem = (item, letter) => {
    if (!item?.client?.surname) return null;
    const surnameInitial = item.client.surname.charAt(0).toUpperCase();
    if (surnameInitial !== letter) return null;

    const Component = pinningClient ? ClientListPinningItem : ClientListItem;

    return (
      <Component
        key={item.id}
        item={item}
        handlePress={
          pinningClient ? handlePressPinningClientItem : handlePressClientItem
        }
      />
    );
  };

  return (
    <>
      <ScrollView style={styles.listContainer}>
        {letters.map(letter => (
          <View style={styles.itemContainer} key={letter}>
            <Text style={styles.alphabetHeader}>{letter}</Text>
            {items.map(item => renderClientListItem(item, letter))}
          </View>
        ))}
      </ScrollView>

      {pinningClient && (
        <SafeInfoButton
          disabled={pinnedClientIds.length === 0}
          handleSubmit={safePinnedProgram}>
          Закріпити
        </SafeInfoButton>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
  },
  itemContainer: {
    marginBottom: 16,
    width: '100%',
  },
  alphabetHeader: {
    color: '#A1A1A1',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
  },
});
