import {StyleSheet, Text, View} from 'react-native';
import {SvgTimeDot} from '../assets/calendarIcons/SvgTimeDot';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {getCurrentTime} from '../redux/action';

export const AgendaTimeLine = ({lineTopNumber}) => {
  const [currentTime, setCurrentTime] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setInterval(function () {
      const date = new Date();
      const returnTimeString = () => {
        return `${date.getHours()}:${
          date.getMinutes().toString().length < 2
            ? `0${date.getMinutes()}`
            : date.getMinutes()
        }`;
      };
      dispatch(getCurrentTime(returnTimeString()));
      setCurrentTime(returnTimeString());
    }, 1000);
  }, [currentTime]);

  return (
    <View
      style={[
        styles.currentTimeLineContainer,
        lineTopNumber && {top: lineTopNumber},
      ]}>
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
    color: '#3EB1CC',
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
    borderBlockColor: '#3EB1CC',
  },
});
