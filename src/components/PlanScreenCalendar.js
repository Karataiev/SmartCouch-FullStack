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
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgBell} from '../assets/calendarIcons/SvgBell';
import React, {useCallback, useMemo, useState} from 'react';
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

defaultLocaleConfig('uk');

const weekTheme = {
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
};

const PlanScreenCalendarComponent = ({date, chooseDate}) => {
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [isOpenFullCalendar, setIsOpenFullCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return monthArray[now.getMonth()];
  });
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear(),
  );

  const openCloseFullCalendar = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 1},
      delete: {type: 'linear', property: 'opacity'},
    });
    setIsOpenFullCalendar(prev => !prev);
  }, []);

  const updateMonthYear = useCallback(dateString => {
    const newDate = new Date(dateString);
    setCurrentMonth(monthArray[newDate.getMonth()]);
    setCurrentYear(newDate.getFullYear());
  }, []);

  const handleDayPress = useCallback(
    day => {
      if (day.dateString !== date) {
        chooseDate(day.dateString);
      }
      updateMonthYear(day.dateString);
    },
    [chooseDate, updateMonthYear, date],
  );

  const handleProviderDateChange = useCallback(
    newDate => {
      if (newDate !== date) {
        chooseDate(newDate);
      }
      updateMonthYear(newDate);
    },
    [chooseDate, updateMonthYear, date],
  );

  const handleProviderMonthChange = useCallback(
    month => {
      const dateString =
        month?.dateString ??
        `${month?.year ?? new Date().getFullYear()}-${String(
          month?.month ?? new Date().getMonth() + 1,
        ).padStart(2, '0')}-01`;
      updateMonthYear(dateString);
    },
    [updateMonthYear],
  );

  const memoizedTheme = useMemo(() => weekTheme, []);

  const memoizedMarkedDates = useMemo(() => {
    if (!date) {
      return undefined;
    }
    return {
      [date]: {
        selected: true,
        selectedColor: '#FFFFFF',
        selectedTextColor: '#000000',
        disableTouchEvent: true,
      },
    };
  }, [date]);

  const calendarProviderDate = date || todayString;

  const weekCalendarProps = useMemo(
    () => ({
      firstDay: 1,
      theme: memoizedTheme,
      onDayPress: handleDayPress,
      current: calendarProviderDate,
      markedDates: memoizedMarkedDates,
    }),
    [calendarProviderDate, memoizedTheme, handleDayPress, memoizedMarkedDates],
  );

  const customCalendarProps = useMemo(
    () => ({
      selectedDate: calendarProviderDate,
      handleDayPress,
      handleMonthChange: handleProviderMonthChange,
    }),
    [calendarProviderDate, handleDayPress, handleProviderMonthChange],
  );

  const calendarMonthTitle = useMemo(
    () => `${currentMonth}, ${currentYear}`,
    [currentMonth, currentYear],
  );

  const renderCalendar = () =>
    !isOpenFullCalendar ? (
      <WeekCalendar {...weekCalendarProps} />
    ) : (
      <CustomMonthCalendar {...customCalendarProps} />
    );

  return (
    <SafeAreaView
      style={[
        styles.container,
        isOpenFullCalendar && styles.fullCalendarContainer,
      ]}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={openCloseFullCalendar}>
          <Text style={styles.calendarMonth}>{calendarMonthTitle}</Text>
          <View style={styles.arrowBlock}>
            {isOpenFullCalendar ? <SvgArrowUp /> : <SvgArrowDown />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bellButton}>
          <SvgBell />
        </TouchableOpacity>
      </View>

      <CalendarProvider
        date={calendarProviderDate}
        onDateChanged={handleProviderDateChange}
        onMonthChange={handleProviderMonthChange}>
        {renderCalendar()}
      </CalendarProvider>
    </SafeAreaView>
  );
};

export const PlanScreenCalendar = React.memo(PlanScreenCalendarComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 184,
    paddingTop: 40,
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
});
