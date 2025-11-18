import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgPhone} from '../assets/svgIcons/SvgPhone';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';

const ClientListItemComponent = ({item, handlePress}) => {
  const clientFullName = useMemo(
    () => `${item.client.name} ${item.client.surname}`,
    [item.client.name, item.client.surname],
  );

  const handlePressItem = useCallback(() => {
    handlePress(item);
  }, [handlePress, item]);

  return (
    <TouchableOpacity style={styles.openItemBtn} onPress={handlePressItem}>
      <View>
        <Text style={styles.name}>{clientFullName}</Text>

        <View style={styles.phoneContainer}>
          <SvgPhone />
          <Text style={styles.phone}>{item.client.number}</Text>
        </View>
      </View>
      <SvgArrowRight />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  openItemBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 20,
    borderRadius: 12,
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

export const ClientListItem = React.memo(ClientListItemComponent);
