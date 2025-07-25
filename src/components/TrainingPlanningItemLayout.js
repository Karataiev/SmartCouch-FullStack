import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const TrainingPlanningItemLayout = ({children, title}) => {
  return (
    <View style={styles.contentItem}>
      <Text style={styles.itemTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  contentItem: {
    marginTop: 24,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'white',
    paddingBottom: 8,
  },
});
