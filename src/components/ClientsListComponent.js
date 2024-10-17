import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgAddBtn} from '../assets/svgIcons/SvgAddBtn';
import {SvgSearch} from '../assets/svgIcons/SvgSearch';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientList} from './ClientList';

export const ClientsListComponent = () => {
  const [value, setValue] = useState('');
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
    if (!value) {
      return el;
    } else {
      return (
        el.client.surname.toLowerCase().includes(value) ||
        el.client.surname.toUpperCase().includes(value)
      );
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#232323'} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Клієнти</Text>
        <TouchableOpacity style={styles.headerAddBtn}>
          <SvgAddBtn />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SvgSearch />
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={setValue}
          placeholder="Пошук за ПІБ"
          placeholderTextColor={'#A1A1A1'}
        />
      </View>

      <ClientList items={searchClient} />
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
  headerAddBtn: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 200,
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
