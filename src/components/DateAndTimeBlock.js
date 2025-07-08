import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {TimestampWheelTrigger} from './TimestampWheelTrigger';
import {SvgPlan} from '../assets/tabIcons/SvgPlan';
import {SvgWatch} from '../assets/svgIcons/SvgWatch';
import {DatePickerComponent} from './DatePickerComponent';

export const DateAndTimeBlock = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const pressDatePickerBtn = () => {
    setDatePickerVisibility(prev => !prev);
  };

  return (
    <View style={styles.dateAndTimeBlock}>
      <View style={styles.dateBlock}>
        <TimestampWheelTrigger
          pressDatePickerBtn={pressDatePickerBtn}
          title="День запису"
          icon={<SvgPlan color="white" />}>
          14 березня 2024
        </TimestampWheelTrigger>

        <DatePickerComponent
          isVisible={isDatePickerVisible}
          pressDatePickerBtn={pressDatePickerBtn}
        />
      </View>

      <View style={styles.timeBlock}>
        <View style={[styles.timeItem, styles.timeItemFirstChild]}>
          <TimestampWheelTrigger title="Початок" icon={<SvgWatch />}>
            11:00
          </TimestampWheelTrigger>
        </View>

        <View style={styles.timeItem}>
          <TimestampWheelTrigger title="Кінець" icon={<SvgWatch />}>
            12:00
          </TimestampWheelTrigger>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateAndTimeBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
  },
  dateBlock: {
    width: '100%',
  },
  timeBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  timeItem: {
    flex: 1,
  },
  timeItemFirstChild: {
    marginRight: 15,
  },
});
