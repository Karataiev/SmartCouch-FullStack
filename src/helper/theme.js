import {Platform} from 'react-native';

export const themeColor = 'red';
export const lightThemeColor = '#292929';

export function getTheme() {
  const disabledColor = 'grey';

  return {
    calendarBackground: 'inherit',
    // month
    monthTextColor: 'black',
    textMonthFontSize: 16,
    textMonthFontWeight: 'bold',
    // day names
    textSectionTitleColor: 'white',
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: 'normal',
    
    // dates
    dayTextColor: 'white',
    textDayFontSize: 18,
    textDayFontWeight: '500',
    textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
    // selected date
    selectedDayBackgroundColor: 'white',
    selectedDayTextColor: '#292929',
    // disabled date
    textDisabledColor: 'white',
    // dot (marked date)
    dotColor: themeColor,
    selectedDotColor: 'white',
    disabledDotColor: disabledColor,
    dotStyle: {marginTop: -2},
    stylesheet: {
      calendar: {
        main: {
            padding: 0,
            margin: 0,
            backgroundColor: 'blue'
        },
        header: {
            padding: 0,
            margin: 0,
            backgroundColor: 'red'
        },
      },
    },
  };
}
