import {StyleSheet, TextInput, View} from 'react-native';
import {SvgSearch} from '../assets/svgIcons/SvgSearch';
import React, {useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientList} from './ClientList';
import {HeaderWithBackButton} from './HeaderWithBackButton';
import {selectClientsList} from '../redux/selectors/clientSelectors';

export const PinningClientsListComponent = ({isForPinning}) => {
  const [searchValue, setSearchValue] = useState('');
  const clients = useSelector(selectClientsList);

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

  const searchClient = useMemo(() => {
    if (!searchValue) {
      return sortedClients;
    }
    const lowerSearch = searchValue.toLowerCase();

    return sortedClients.filter(
      el =>
        el.client.surname.toLowerCase().includes(lowerSearch) ||
        el.client.name.toLowerCase().includes(lowerSearch),
    );
  }, [sortedClients, searchValue]);

  return (
    <View style={styles.container}>
      <HeaderWithBackButton>Оберіть клієнта</HeaderWithBackButton>

      <View style={styles.searchContainer}>
        <SvgSearch />
        <TextInput
          style={styles.searchInput}
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Пошук за ПІБ"
          placeholderTextColor={'#A1A1A1'}
        />
      </View>

      <ClientList items={searchClient} pinningClient={isForPinning} />
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: 'white',
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
  },
});
