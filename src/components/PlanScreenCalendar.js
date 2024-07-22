import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {SvgArrowDown} from '../assets/calendarIcons/SvgArrowDown';
import {SvgBell} from '../assets/calendarIcons/SvgBell';
import {SvgArrowUp} from '../assets/calendarIcons/SvgArrowUp';
import {defaultLocaleConfig} from '../helper/localeConfig';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

defaultLocaleConfig('ua');

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
  const [isOpen, setIsOpen] = useState(false);
  const [fullDate, setFullDate] = useState('');
  const [currentContainerStyles, setCurrentContainerStyles] = useState(
    styles.calendarHeaderContainer,
  );

  let data = new Date();

  useEffect(() => {
    const getRightInfo = num => {
      return num.toString().length === 1 ? '0' + num.toString() : num;
    };
    setFullDate(
      `${data.getFullYear()}-${getRightInfo(
        Number(data.getMonth()) + 1,
      )}-${getRightInfo(data.getDate())}`,
    );

    LayoutAnimation.configureNext({
      duration: 1500,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 1},
      delete: {type: 'linear', property: 'opacity'},
    });

    isOpen
      ? setCurrentContainerStyles(styles.calendarActiveHeaderContainer)
      : setCurrentContainerStyles(styles.calendarHeaderContainer);
  }, [isOpen]);

  const handleCalendarButton = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={currentContainerStyles}>
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

      <View style={styles.weekContainer}>
        {daysArray.map(el => (
          <TouchableOpacity style={styles.dayContainer} key={el}>
            <Text style={styles.dayStyle}>{el}</Text>
            <Text style={styles.dayNumberStyle}>{data.getDate()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarHeaderContainer: {
    flex: 1,
    maxHeight: 143,
    paddingHorizontal: 20,
    backgroundColor: '#292929',
    borderBottomLeftRadius: 20,
    borderBottomEndRadius: 20,
  },
  calendarActiveHeaderContainer: {
    flex: 1,
    maxHeight: 353,
    paddingHorizontal: 20,
    backgroundColor: '#292929',
    borderBottomLeftRadius: 20,
    borderBottomEndRadius: 20,
    color: 'white',
  },
  calendarHeader: {
    height: 44,
    width: '100%',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '32%',
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
  weekContainer: {
    width: '100%',
    height: 66,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 66,
  },
  dayStyle: {
    color: 'white',
    fontSize: 12,
    lineHeight: 16,
  },
  dayNumberStyle: {
    marginTop: 8,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  activeDay: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 66,
    backgroundColor: 'white',
    borderRadius: 100,
  },
});
