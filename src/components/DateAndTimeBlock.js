import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TimestampWheelTrigger} from './TimestampWheelTrigger';
import {SvgPlan} from '../assets/tabIcons/SvgPlan';
import {SvgWatch} from '../assets/svgIcons/SvgWatch';
import {DatePickerComponent} from './DatePickerComponent';

export const DateAndTimeBlock = ({
  date,
  setDate,
  isDatePickerVisible,
  setDatePickerVisibility,
  setOneTimeTrainingDate,
  isCheckedDayAndTimeBlock,
}) => {
  const [formattedDate, setFormattedDate] = useState(null);
  const [dayTimeFrom, setDayTimeFrom] = useState('');
  const [dayTimeTo, setDayTimeTo] = useState('');

  useEffect(() => {
    if (isCheckedDayAndTimeBlock) {
      setDayTimeFrom('');
      setDayTimeTo('');
      setFormattedDate(null);
      setDate(null);
      setOneTimeTrainingDate([]);
    }

    if (!date) {
      return;
    }
    const [year, month, day] = date.split('-');
    const months = [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня',
    ];
    const monthName = months[parseInt(month, 10) - 1];
    const fulldate = `${parseInt(day, 10)} ${monthName} ${year} р.`;
    setFormattedDate(fulldate);

    setOneTimeTrainingDate([
      {
        date: fulldate,
        time: [dayTimeFrom, dayTimeTo],
      },
    ]);
  }, [date, dayTimeFrom, dayTimeTo, isCheckedDayAndTimeBlock]);

  const formatTimeInput = text => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  return (
    <View style={styles.dateAndTimeBlock}>
      <View style={styles.dateBlock}>
        <TimestampWheelTrigger
          pressDatePickerBtn={() => setDatePickerVisibility(prev => !prev)}
          title="День запису"
          icon={<SvgPlan color="white" />}>
          {formattedDate || 'Оберіть дату'}
        </TimestampWheelTrigger>

        <DatePickerComponent
          isVisible={isDatePickerVisible}
          pressDatePickerBtn={setDatePickerVisibility}
          date={date}
          setDate={setDate}
          isCheckedDayAndTimeBlock={isCheckedDayAndTimeBlock}
        />
      </View>

      <View style={styles.timeBlock}>
        <View style={[styles.timeItem, styles.timeItemFirstChild]}>
          <Text style={styles.timeItemTitle}>Початок</Text>
          <View style={styles.timeItemBlock}>
            <SvgWatch />
            <TextInput
              style={styles.singleInput}
              placeholder="00:00"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={5}
              value={dayTimeFrom}
              onChangeText={text => setDayTimeFrom(formatTimeInput(text))}
            />
          </View>
        </View>

        <View style={styles.timeItem}>
          <Text style={styles.timeItemTitle}>Кінець</Text>
          <View style={styles.timeItemBlock}>
            <SvgWatch />
            <TextInput
              style={styles.singleInput}
              placeholder="00:00"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={5}
              value={dayTimeTo}
              onChangeText={text => setDayTimeTo(formatTimeInput(text))}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateAndTimeBlock: {
    marginTop: 24,
  },
  dateBlock: {
    width: '100%',
  },
  timeBlock: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
  },
  timeItem: {
    width: '50%',
    marginTop: 12,
    paddingLeft: 12,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
  },
  timeItemTitle: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
    marginBottom: 6,
  },
  timeItemBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeItemFirstChild: {
    marginRight: 15,
  },
  singleInput: {
    paddingLeft: 8,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400',
    color: 'white',
    flex: 1,
  },
});
