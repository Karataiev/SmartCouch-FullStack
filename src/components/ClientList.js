import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useEffect, useState} from 'react';
import {ClientListItem} from './ClientListItem';
import {ClientListPinningItem} from './ClientListPinningItem';
import {SafeInfoButton} from './SafeInfoButton';
import {useDispatch, useSelector} from 'react-redux';
import {updateClientsArray} from '../redux/action';

export const ClientList = ({items, navigation, pinningClient, route}) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients);

  const [letters, setLetters] = useState([]);
  const [pinnedClientIds, setPinnedClientIds] = useState([]);

  useEffect(() => {
    const getEveryItemFirstLetters = items.map(item => {
      const firstLetter = item.client.surname.split('');
      return firstLetter[0];
    });
    const uniqueArr = [...new Set(getEveryItemFirstLetters)];
    setLetters(uniqueArr);
  }, [items]);

  const handlePressClientItem = item => {
    navigation.navigate('ClientsProfileScreen', {
      itemData: item,
    });
  };

  const handlePressPinningClientItem = (item, setIsChecked, isChecked) => {
    setIsChecked(!isChecked);

    if (pinnedClientIds.includes(item.id)) {
      const updatedArray = pinnedClientIds.filter(id => id !== item.id);
      setPinnedClientIds([...updatedArray]);
    } else {
      setPinnedClientIds([...pinnedClientIds, item.id]);
    }
  };

  const safePinnedProgram = () => {
    const {itemData} = route.params;
    pinnedClientIds.forEach(id => {
      clients.map((client, index) => {
        if (client.id === id) {
          client.program = {
            title: itemData.title,
            program: itemData.program,
          };
          clients.splice(index, 1, client);
          dispatch(updateClientsArray(clients));
        }
      });
    });
    navigation.goBack();
  };

  const renderClientListItem = (item, letter) => {
    const firstLetter = item.client.surname.split('');

    if (letter.toUpperCase() === firstLetter[0].toUpperCase()) {
      if (pinningClient) {
        return (
          <ClientListPinningItem
            item={item}
            key={item.id}
            handlePress={handlePressPinningClientItem}
          />
        );
      } else {
        return (
          <ClientListItem
            item={item}
            key={item.id}
            handlePress={handlePressClientItem}
          />
        );
      }
    }
  };

  return (
    <>
      <ScrollView style={styles.listContainer}>
        {letters.map(le => (
          <View style={styles.itemContainer} key={le}>
            <Text style={styles.alphabetHeader}>{le.toUpperCase()}</Text>

            {items.map(item => renderClientListItem(item, le))}
          </View>
        ))}
      </ScrollView>
      {pinningClient && (
        <SafeInfoButton
          disabled={pinnedClientIds.length === 0}
          handleSubmit={() => safePinnedProgram()}>
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
