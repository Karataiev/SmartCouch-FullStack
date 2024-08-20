import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  LayoutAnimation,
} from 'react-native';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import {agendaItems} from '../mocks/agendaItems';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgBell} from '../assets/calendarIcons/SvgBell';
import {useEffect, useState} from 'react';
import {SvgArrowUp} from '../assets/calendarIcons/SvgArrowUp';
import {SvgArrowDown} from '../assets/calendarIcons/SvgArrowDown';

const monthArray = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];
const daysArray = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export const PlanScreenCalendar = () => {
  const ITEMS = agendaItems;

  const [isOpen, setIsOpen] = useState(false);

  let data = new Date();
  const currentDayValue = data.getDate();

  useEffect(() => {
    const getRightInfo = num => {
      return num.toString().length === 1 ? '0' + num.toString() : num;
    };
    const currentDate = `${data.getFullYear()}-${getRightInfo(
      Number(data.getMonth()) + 1,
    )}-${getRightInfo(currentDayValue)}`;

    // LayoutAnimation.configureNext({
    //   duration: 1500,
    //   create: {type: 'linear', property: 'opacity'},
    //   update: {type: 'spring', springDamping: 1},
    //   delete: {type: 'linear', property: 'opacity'},
    // });
  }, []);

  const handleCalendarButton = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => handleCalendarButton()}>
          <Text style={styles.calendarMonth}>{`${
            monthArray[data.getMonth()]
          }, ${data.getFullYear()}`}</Text>
          {isOpen ? <SvgArrowUp /> : <SvgArrowDown />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.bellButton}>
          <SvgBell />
        </TouchableOpacity>
      </View>

      <CalendarProvider date={ITEMS[1]?.title}>
        <WeekCalendar
          firstDay={1}
          theme={styles.weekCalendarTheme}
          dayComponent={({date, state}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.dayContainer,
                  state === 'selected' && styles.currentCustomDayContainer,
                ]}>
                <Text
                  style={[
                    styles.customDay,
                    currentDayValue === date.day && styles.activeText,
                  ]}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
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
    width: '59%',
    justifyContent: 'space-between',
  },
  calendarMonth: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
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
    // textDayHeaderFontSize: 12,
    // selectedDayBackgroundColor: 'white',
    // selectedDayTextColor: 'black',
    // todayBackgroundColor: 'white',
    // todayTextColor: 'black',

    // textDayStyle: {
    //   color: 'white',
    //   fontSize: 17,
    //   fontWeight: 'bold',
    // },
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 32,
  },
  currentCustomDayContainer: {
    borderWidth: 2,
    borderColor: '#FFFF65',
    borderRadius: 100,
  },
  customDay: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  activeText: {
    color: '#FFFF65',
  },
});
