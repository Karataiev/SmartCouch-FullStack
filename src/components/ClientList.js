import React, {useState, useMemo} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ClientListItem} from './ClientListItem';
import {ClientListPinningItem} from './ClientListPinningItem';
import {SafeInfoButton} from './SafeInfoButton';
import {updateClientProgram} from '../redux/action';

export const ClientList = ({items, navigation, pinningClient, route}) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients);

  const [pinnedClientIds, setPinnedClientIds] = useState([]);

  const letters = useMemo(() => {
    const firstLetters = items.map(item =>
      item.client.surname?.charAt(0).toUpperCase(),
    );
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
    const {itemData} = route.params;

    clients.map(client => {
      if (pinnedClientIds.includes(client.id)) {
        const clientProgram = {
          id: itemData.id,
          title: itemData.title,
          program: itemData.program,
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
    navigation.goBack();
  };

  const renderClientListItem = (item, letter) => {
    const surnameInitial = item.client.surname?.charAt(0).toUpperCase();
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
