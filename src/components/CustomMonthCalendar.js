import React, {useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {CalendarList} from 'react-native-calendars';

const {width} = Dimensions.get('window');

export const CustomMonthCalendar = ({
  selectedDate,
  setSelectedDate,
  isCheckedDayAndTimeBlock,
}) => {
  useEffect(() => {
    if (isCheckedDayAndTimeBlock) {
      setSelectedDate(null);
    }
  }, [isCheckedDayAndTimeBlock]);

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
  };

  return (
    <CalendarList
      horizontal
      pagingEnabled
      calendarWidth={width}
      firstDay={1}
      hideArrows
      renderHeader={() => null}
      pastScrollRange={12}
      futureScrollRange={12}
      onDayPress={handleDayPress}
      markedDates={{
        [selectedDate]: {
          selected: true,
          selectedColor: 'white',
          selectedTextColor: 'black',
        },
      }}
      style={styles.calendarCustomStyles}
      theme={styles.theme}
    />
  );
};

const styles = StyleSheet.create({
  theme: {
    calendarBackground: 'transparent',
    textDayHeaderFontSize: 15,
    todayBackgroundColor: '#3EB1CC',
    todayTextColor: 'black',
    textDayStyle: {
      color: 'white',
      fontSize: 15,
    },
  },
  calendarCustomStyles: {
    height: 320,
    width: width,
  },
});
