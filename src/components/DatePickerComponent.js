import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {CustomMonthCalendar} from './CustomMonthCalendar';

export const DatePickerComponent = ({
  isVisible,
  pressDatePickerBtn,
  date,
  setDate,
}) => {
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
    outputRange: [0, 350],
  });

  const handleConfirm = () => {
    pressDatePickerBtn(false);
  };

  return (
    <Animated.View
      style={[styles.animatedContainer, {height: heightInterpolate}]}>
      <View style={styles.pickerContainer}>
        <CustomMonthCalendar selectedDate={date} setSelectedDate={setDate} />
        <TouchableOpacity onPress={handleConfirm} style={styles.button}>
          <Text style={styles.buttonText}>Готово</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  pickerContainer: {
    height: 300,
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  button: {
    minWidth: '100%',
    paddingVertical: 12,
    backgroundColor: '#FFFF65',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
  },
});
