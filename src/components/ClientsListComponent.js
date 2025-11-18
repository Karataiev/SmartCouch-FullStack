import React, {useCallback, useDeferredValue, useMemo, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {SvgSearch} from '../assets/svgIcons/SvgSearch';
import {useSelector} from 'react-redux';
import {ClientList} from './ClientList';
import {HeaderForScreens} from './HeaderForScreens';
import {selectClientsList} from '../redux/selectors/clientSelectors';

export const ClientsListComponent = ({
  navigation,
  isForPinning,
  onPressAdd,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const clients = useSelector(selectClientsList);

  const deferredSearch = useDeferredValue(searchValue);

  const sortedClients = useMemo(() => {
    if (!clients?.length) {
      return [];
    }

    return [...clients].sort((a, b) =>
      a.client.surname.localeCompare(b.client.surname, 'uk', {
        sensitivity: 'base',
      }),
    );
  }, [clients]);

  const filteredClients = useMemo(() => {
    if (!deferredSearch) {
      return sortedClients;
    }

    const lowerSearch = deferredSearch.toLowerCase();

    return sortedClients.filter(
      el =>
        el.client.surname.toLowerCase().includes(lowerSearch) ||
        el.client.name.toLowerCase().includes(lowerSearch),
    );
  }, [sortedClients, deferredSearch]);

  const handleSearchChange = useCallback(text => {
    setSearchValue(text);
  }, []);

  return (
    <View style={styles.container}>
      <HeaderForScreens
        navigation={navigation}
        addBtn={true}
        onPressAdd={onPressAdd}>
        Клієнти
      </HeaderForScreens>

      <View style={styles.searchContainer}>
        <SvgSearch />
        <TextInput
          style={styles.searchInput}
          value={searchValue}
          onChangeText={handleSearchChange}
          placeholder="Пошук за ПІБ"
          placeholderTextColor={'#A1A1A1'}
        />
      </View>

      <ClientList
        items={filteredClients}
        navigation={navigation}
        pinningClient={isForPinning}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    width: '100%',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 6,
    width: '100%',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#565656',
  },
  searchInput: {
    color: 'white',
    flex: 1,
  },
});
