import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckboxComponent} from './CheckboxComponent';
import {weekDaysObj} from '../helper/weekDaysObject';
import {TimeInputComponent} from './TimeInputComponent';
import {HidenDayAndTimeBlock} from './HidenDayAndTimeBlock';
import {dayTimeStyles} from '../shared/dayTimeStyles';

export const DayAndTimeBlock = ({setConstantDate, isChecked, setIsChecked}) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayTimeMap, setDayTimeMap] = useState({});

  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleBlock = () => setIsChecked(prev => !prev);

  const toggleDay = day => {
    setSelectedDays(prev => {
      const updated = prev.includes(day.id)
        ? prev.filter(id => id !== day.id)
        : [...prev, day.id];

      if (!prev.includes(day.id)) {
        setDayTimeMap(map => ({
          ...map,
          [day.id]: ['', ''],
        }));
      }

      return updated;
    });
  };

  const handleTimeChange = (dayId, from, to) => {
    setDayTimeMap(map => ({
      ...map,
      [dayId]: [from, to],
    }));
  };

  useEffect(() => {
    if (isChecked) {
      const result = selectedDays.map(dayId => ({
        date: dayId,
        time: dayTimeMap[dayId] || ['', ''],
      }));
      setConstantDate(result);
    } else {
      setConstantDate([]);
    }
  }, [selectedDays, dayTimeMap, isChecked]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isChecked ? contentHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isChecked, contentHeight]);

  return (
    <View
      style={[
        styles.dayAndTimeBlock,
        isChecked && styles.activeDayAndTimeBlock,
      ]}>
      <TouchableOpacity style={styles.dayAndTimeBtn} onPress={toggleBlock}>
        <Text style={styles.title}>Повторюване тренування</Text>
        <CheckboxComponent pinned={isChecked} />
      </TouchableOpacity>

      <Animated.View
        style={[styles.animatedContainer, {height: animatedHeight}]}>
        <View style={dayTimeStyles.visibleContent}>
          <View style={dayTimeStyles.daysBlock}>
            {weekDaysObj.map(day => {
              const isSelected = selectedDays.includes(day.id);
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => toggleDay(day)}
                  style={[
                    dayTimeStyles.dayItem,
                    isSelected && dayTimeStyles.dayItemActive,
                  ]}>
                  <Text
                    style={[
                      dayTimeStyles.dayTitle,
                      isSelected && dayTimeStyles.dayTitleActive,
                    ]}>
                    {day.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedDays.length > 0 && (
            <View style={dayTimeStyles.selectedDaysContainer}>
              {selectedDays.map(dayId => {
                const dayObj = weekDaysObj.find(d => d.id === dayId);
                const [from, to] = dayTimeMap[dayId] || ['', ''];
                return (
                  <View key={dayId} style={dayTimeStyles.listItem}>
                    <Text style={dayTimeStyles.listItemText}>
                      {dayObj?.title || dayId}
                    </Text>
                    <TimeInputComponent
                      timeFrom={from}
                      timeTo={to}
                      onChange={(from, to) => handleTimeChange(dayId, from, to)}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </Animated.View>

      <HidenDayAndTimeBlock
        setContentHeight={setContentHeight}
        selectedDays={selectedDays}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dayAndTimeBlock: {
    flexDirection: 'column',
    marginTop: 24,
  },
  activeDayAndTimeBlock: {
    backgroundColor: '#232929',
    borderRadius: 16,
  },
  dayAndTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#232929',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'white',
  },
  animatedContainer: {
    overflow: 'hidden',
  },
});
