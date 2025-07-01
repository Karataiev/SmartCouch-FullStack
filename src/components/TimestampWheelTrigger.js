import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

export const TimestampWheelTrigger = ({title, children, icon}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.pickDateBtn}>
        {icon}
        <Text style={styles.dateInfo}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
    marginBottom: 6,
  },
  pickDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingLeft: 9,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
  },
  dateInfo: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    color: 'white',
    marginLeft: 10,
  },
});
