import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import {agendaItems} from '../mocks/agendaItems';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgBell} from '../assets/calendarIcons/SvgBell';
import React, {useState} from 'react';
import {SvgArrowUp} from '../assets/calendarIcons/SvgArrowUp';
import {SvgArrowDown} from '../assets/calendarIcons/SvgArrowDown';
import {defaultLocaleConfig, monthArray} from '../helper/localeConfig';
import {CustomMonthCalendar} from './CustomMonthCalendar';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

defaultLocaleConfig('en');

export const PlanScreenCalendar = () => {
  const ITEMS = agendaItems;
  let data = new Date();

  const [isOpenFullCalendar, setIsOpenFullCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(monthArray[data.getMonth()]);
  const [currentYear, setCurrentYear] = useState(data.getFullYear());

  const openCloseFullCalendar = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 1},
      delete: {type: 'linear', property: 'opacity'},
    });
    setIsOpenFullCalendar(!isOpenFullCalendar);
  };

  const getActualData = months => {
    setCurrentMonth(monthArray[months[0].month - 1]);
    setCurrentYear(months[0].year);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        isOpenFullCalendar && styles.fullCalendarContainer,
      ]}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => openCloseFullCalendar()}>
          <Text
            style={
              styles.calendarMonth
            }>{`${currentMonth}, ${currentYear}`}</Text>
          <View style={styles.arrowBlock}>
            {isOpenFullCalendar ? <SvgArrowUp /> : <SvgArrowDown />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bellButton}>
          <SvgBell />
        </TouchableOpacity>
      </View>

      <CalendarProvider date={ITEMS[1]?.title}>
        {!isOpenFullCalendar ? (
          <WeekCalendar firstDay={1} theme={styles.weekCalendarTheme} />
        ) : (
          <CustomMonthCalendar getActualData={getActualData} />
        )}
      </CalendarProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 144,
    backgroundColor: '#232929',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  fullCalendarContainer: {
    maxHeight: 330,
  },
  calendarHeader: {
    width: '100%',
    paddingTop: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarMonth: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  arrowBlock: {
    marginLeft: 10,
  },
  bellButton: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(133, 193, 219, 0.15)',
    borderRadius: 50,
  },
  weekCalendarTheme: {
    calendarBackground: 'transparent',
    textDayHeaderFontSize: 12,
    selectedDayBackgroundColor: 'white',
    selectedDayTextColor: 'black',
    todayBackgroundColor: '#3EB1CC',
    todayTextColor: 'black',

    textDayStyle: {
      color: 'white',
      fontSize: 17,
      fontWeight: 'bold',
    },
  },
});
