import {StyleSheet, Text, View} from 'react-native';
import {SvgTimeDot} from '../assets/calendarIcons/SvgTimeDot';
import {useEffect, useState} from 'react';

export const AgendaTimeLine = () => {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    const time = setInterval(function () {
      const date = new Date();
      const returnTimeString = () => {
        return `${date.getHours() + 3}:${
          date.getMinutes() < 2 ? `0${date.getMinutes()}` : date.getMinutes()
        }`;
      };
      setCurrentTime(returnTimeString);
    }, 1000);
  }, []);

  return (
    <View style={styles.currentTimeLineContainer}>
      <Text style={styles.currentTime}>{currentTime}</Text>
      <View style={styles.currentLine}>
        <SvgTimeDot />
        <View style={styles.line} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  currentTimeLineContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 5,
  },
  currentTime: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
    color: '#FFFF65',
  },
  currentLine: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: '100%',
    borderTopWidth: 1,
    borderBlockColor: '#FFFF65',
  },
});
