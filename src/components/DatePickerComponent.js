import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

export const DatePickerComponent = ({isVisible, pressDatePickerBtn}) => {
  const [date, setDate] = useState(new Date());
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  return (
    <Animated.View
      style={[styles.animatedContainer, {height: heightInterpolate}]}>
      <View style={styles.pickerContainer}>
        <DatePicker
          date={date}
          onDateChange={setDate}
          mode="date"
          locale="uk"
          androidVariant="iosClone"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    overflow: 'hidden',
  },
  pickerContainer: {
    backgroundColor: '#232323',
    paddingHorizontal: 20,
  },
});
