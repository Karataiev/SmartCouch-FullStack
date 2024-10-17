import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';
import {SvgPhone} from '../assets/svgIcons/SvgPhone';
import {ScrollView} from 'react-native-gesture-handler';
import {UA_ALPHABET} from '../helper/uaAlphabet';
import {useEffect, useState} from 'react';

export const ClientList = ({items}) => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const getEveryItemFirstLetters = items.map(item => {
      const firstLetter = item.client.surname.split('');
      return firstLetter[0];
    });
    const uniqueArr = [...new Set(getEveryItemFirstLetters)];
    setLetters(uniqueArr);
  }, []);

  return (
    <ScrollView style={styles.listContainer}>
      {letters.map(le => (
        <View style={styles.itemContainer} key={le}>
          <Text style={styles.alphabetHeader}>{le.toUpperCase()}</Text>

          {items.map((item, idx) => {
            const firstLetter = item.client.surname.split('');

            if (le.toUpperCase() === firstLetter[0].toUpperCase()) {
              return (
                <TouchableOpacity style={styles.openItemBtn} key={idx}>
                  <View style={styles.clientInfo}>
                    <Text style={styles.name}>
                      {`${item.client.name} ${item.client.surname}`}
                    </Text>

                    <View style={styles.phoneContainer}>
                      <SvgPhone />
                      <Text style={styles.phone}>{item.client.number}</Text>
                    </View>
                  </View>
                  <SvgArrowRight />
                </TouchableOpacity>
              );
            }
          })}
        </View>
      ))}
    </ScrollView>
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
  openItemBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 8,
    width: '100%',
    backgroundColor: '#2E2E2E',
    borderRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    color: '#FFFFFF',
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  phone: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#A1A1A1',
  },
});
