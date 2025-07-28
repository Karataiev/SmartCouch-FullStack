import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgPhone} from '../assets/svgIcons/SvgPhone';
import {CheckboxComponent} from './CheckboxComponent';
import React, {useState} from 'react';

export const ClientListPinningItem = ({item, handlePress}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <TouchableOpacity
      style={styles.openItemBtn}
      onPress={() => handlePress(item, setIsChecked, isChecked)}>
      <CheckboxComponent pinned={isChecked} />
      <View>
        <Text style={styles.name}>
          {`${item.client.name} ${item.client.surname}`}
        </Text>
        <View style={styles.phoneContainer}>
          <SvgPhone />
          <Text style={styles.phone}>{item.client.number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  openItemBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    padding: 20,
    borderRadius: 12,
    gap: 12,
    backgroundColor: '#232929',
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
