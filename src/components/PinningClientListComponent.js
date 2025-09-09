import {StyleSheet, TextInput, View} from 'react-native';
import {SvgSearch} from '../assets/svgIcons/SvgSearch';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientList} from './ClientList';
import {HeaderWithBackButton} from './HeaderWithBackButton';

export const PinningClientsListComponent = ({isForPinning}) => {
  const [searchValue, setSearchValue] = useState('');
  const clients = useSelector(state => state.clients);

  const sortByAlphabet = clients.sort((a, b) => {
    if (a.client.surname < b.client.surname) {
      return -1;
    }
    if (a.client.surname > b.client.surname) {
      return 1;
    }
    return 0;
  });

  const searchClient = sortByAlphabet.filter(el => {
    if (!searchValue) {
      return el;
    } else {
      return (
        el.client.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.client.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  });

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
