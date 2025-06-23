import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ClientParameterItem} from './ClientParameterItem';

export const ClientParametersContent = ({
  data,
  values,
  onValueChange,
  columnKeyPrefix,
}) => {
  return (
    <View style={styles.wrapper}>
      {data.map(item => (
        <ClientParameterItem
          key={`${columnKeyPrefix}-${item.key}`}
          item={item}
          value={values?.[item.key] || ''}
          onChangeText={val => onValueChange(item.key, val)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 24,
  },
});
