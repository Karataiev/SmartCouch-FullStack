import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckboxComponent} from './CheckboxComponent';
import {weekDaysObj} from '../helper/weekDaysObject';
import {TimeInputComponent} from './TimeInputComponent';
import {HidenDayAndTimeBlock} from './HidenDayAndTimeBlock';
import {dayTimeStyles} from '../shared/dayTimeStyles';

export const DayAndTimeBlock = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleBlock = () => setIsChecked(prev => !prev);

  const toggleDay = day => {
    setSelectedDays(prev =>
      prev.includes(day.id)
        ? prev.filter(id => id !== day.id)
        : [...prev, day.id],
    );
  };

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
              {weekDaysObj
                .filter(day => selectedDays.includes(day.id))
                .map(day => (
                  <View key={day.id} style={dayTimeStyles.listItem}>
                    <Text style={dayTimeStyles.listItemText}>{day.title}</Text>
                    <TimeInputComponent />
                  </View>
                ))}
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
    backgroundColor: '#2E2E2E',
    borderRadius: 16,
  },
  dayAndTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#2E2E2E',
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
