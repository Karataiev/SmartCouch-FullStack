import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {CalendarList} from 'react-native-calendars';

const {width} = Dimensions.get('window');

export const CustomMonthCalendar = ({
  selectedDate,
  handleDayPress,
  handleMonthChange,
}) => {
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
      onDayPress={day => handleDayPress(day)}
      markedDates={
        selectedDate
          ? {
              [selectedDate]: {
                selected: true,
                selectedColor: 'white',
                selectedTextColor: 'black',
              },
            }
          : undefined
      }
      onVisibleMonthsChange={months => {
        if (months?.length && handleMonthChange) {
          handleMonthChange(months[0]);
        }
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
