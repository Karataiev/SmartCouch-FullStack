import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {weekDaysObj} from '../helper/weekDaysObject';
import {TimeInputComponent} from './TimeInputComponent';
import {dayTimeStyles} from '../shared/dayTimeStyles';

export const HidenDayAndTimeBlock = ({setContentHeight, selectedDays}) => {
  return (
    <View
      style={styles.hiddenContent}
      onLayout={event => {
        const height = event.nativeEvent.layout.height;
        setContentHeight(height);
      }}>
      <View style={dayTimeStyles.visibleContent}>
        <View style={dayTimeStyles.daysBlock}>
          {weekDaysObj.map(day => (
            <View key={day.id} style={dayTimeStyles.dayItem}>
              <Text style={dayTimeStyles.dayTitle}>{day.id}</Text>
            </View>
          ))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContent: {
    position: 'absolute',
    top: -9999,
    left: 0,
    right: 0,
    opacity: 0,
  },
});
