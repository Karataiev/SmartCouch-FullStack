import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  LayoutAnimation,
  UIManager,
  StatusBar,
} from 'react-native';
import {
  CalendarProvider,
  WeekCalendar,
  CalendarList,
} from 'react-native-calendars';
import {agendaItems} from '../mocks/agendaItems';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgBell} from '../assets/calendarIcons/SvgBell';
import {useEffect, useState} from 'react';
import {SvgArrowUp} from '../assets/calendarIcons/SvgArrowUp';
import {SvgArrowDown} from '../assets/calendarIcons/SvgArrowDown';
import {defaultLocaleConfig, monthArray} from '../helper/localeConfig';

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

  // const currentDayValue = data.getDate();
  // setCurrentMonth(monthArray[data.getMonth()]);
  // setCurrentYear(data.getFullYear());

  // const getRightInfo = num => {
  //   return num.toString().length === 1 ? '0' + num.toString() : num;
  // };
  // const currentDate = `${data.getFullYear()}-${getRightInfo(
  //   Number(data.getMonth()) + 1,
  // )}-${getRightInfo(currentDayValue)}`;

  // useEffect(() => {
  //   LayoutAnimation.configureNext({
  //     duration: 1500,
  //     create: {type: 'linear', property: 'opacity'},
  //     update: {type: 'spring', springDamping: 1},
  //     delete: {type: 'linear', property: 'opacity'},
  //   });
  // }, []);

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
      <StatusBar backgroundColor={'#292929'} />
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
          <CalendarList
            firstDay={1}
            horizontal={true}
            theme={styles.monthCalendarTheme}
            renderHeader={() => null}
            onVisibleMonthsChange={months => getActualData(months)}
            pagingEnabled={true}
          />
        )}
      </CalendarProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 144,
    backgroundColor: '#292929',
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
    backgroundColor: '#424242',
    borderRadius: 50,
  },
  weekCalendarTheme: {
    calendarBackground: 'transparent',
    textDayHeaderFontSize: 12,
    selectedDayBackgroundColor: 'white',
    selectedDayTextColor: 'black',
    todayBackgroundColor: '#FFFF65',
    todayTextColor: 'black',

    textDayStyle: {
      color: 'white',
      fontSize: 17,
      fontWeight: 'bold',
    },
  },
  monthCalendarTheme: {
    calendarBackground: 'transparent',
    textDayHeaderFontSize: 15,
    selectedDayBackgroundColor: 'white',
    selectedDayTextColor: 'black',
    todayBackgroundColor: '#FFFF65',
    todayTextColor: 'black',

    textDayStyle: {
      color: 'white',
      fontSize: 15,
    },
  },
});
