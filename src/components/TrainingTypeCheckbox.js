import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {CheckboxComponent} from './CheckboxComponent';

export const TrainingTypeCheckbox = ({
  type,
  title,
  color,
  isSelected,
  onSelect,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.serviceTypeItem, style]}
      onPress={onSelect}>
      <CheckboxComponent pinned={isSelected} />
      <Text style={[styles.badge, {backgroundColor: color}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceTypeItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#2E2E2E',
  },
  badge: {
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingTop: 5,
    paddingBottom: 3,
    lineHeight: 10,
    borderRadius: 30,
  },
});
