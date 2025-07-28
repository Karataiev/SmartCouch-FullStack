import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';

export const ProgramItem = ({info, handleClick}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => handleClick()}>
      <Text style={styles.title} numberOfLines={1}>
        {info.title}
      </Text>
      <SvgArrowRight />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#232929',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: 'white',
  },
});
