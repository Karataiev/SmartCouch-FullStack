import React, {useMemo, useState} from 'react';
import {StatusBar, StyleSheet, TextInput, View} from 'react-native';
import {SvgSearch} from '../assets/svgIcons/SvgSearch';
import {useSelector} from 'react-redux';
import {ClientList} from './ClientList';
import {HeaderForScreens} from './HeaderForScreens';

export const ClientsListComponent = ({
  navigation,
  isForPinning,
  onPressAdd,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const clients = useSelector(state => state.clients);

  const filteredClients = useMemo(() => {
    const sorted = [...clients].sort((a, b) => {
      if (a.client.surname < b.client.surname) {
        return -1;
      }
      if (a.client.surname > b.client.surname) {
        return 1;
      }
      return 0;
    });

    if (!searchValue) {
      return sorted;
    }

    const lowerSearch = searchValue.toLowerCase();

    return sorted.filter(
      el =>
        el.client.surname.toLowerCase().includes(lowerSearch) ||
        el.client.name.toLowerCase().includes(lowerSearch),
    );
  }, [clients, searchValue]);

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
          onChangeText={setSearchValue}
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
