import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {useNavigation} from '@react-navigation/native';

export const AgendaItem = ({data, item, currentTime}) => {
  const navigation = useNavigation();

  const timeIdArr = useMemo(
    () => item?.timeId?.split(':') || ['00', '00'],
    [item?.timeId],
  );

  const currentTimeArr = useMemo(
    () => currentTime?.split(':') || ['00', '00'],
    [currentTime],
  );

  const {status, statusIcon, statusStyle} = useMemo(() => {
    if (+currentTimeArr[0] > +timeIdArr[0]) {
      return {
        status: 'Проведено',
        statusIcon: <SvgDoneStatus />,
        statusStyle: {color: '#00CA8D'},
      };
    }
    if (+currentTimeArr[0] < +timeIdArr[0]) {
      return {
        status: 'Очікується',
        statusIcon: <SvgWaitingStatus />,
        statusStyle: {color: '#FFFFFF'},
      };
    }
    return {
      status: 'Триває',
      statusIcon: <SvgInProgressStatus />,
      statusStyle: {color: '#F79605'},
    };
  }, [currentTimeArr, timeIdArr]);

  const returnTrainingName = name => (name ? name : 'Gym');

  const returnTypeOfTrainingStyle = type =>
    type === 'personal'
      ? {backgroundColor: '#00704F'}
      : {backgroundColor: '#4195B9'};

  const showClientName = el => {
    if (!el.client) {
      return el.trainingType === 'personal'
        ? 'УТОЧНИТИ ДАНІ КЛІЄНТА'
        : 'ГРУПОВЕ ТРЕНУВАННЯ';
    }
    return `${el.client?.client.name} ${el.client?.client.surname}`.toUpperCase();
  };

  const handleItemClick = () => {
    // navigation.navigate('ScheduledTraining');
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handleItemClick}>
      <View style={styles.itemCommonStyles}>
        <Text style={styles.itemFirstText}>
          {returnTrainingName(data.trainingName)}
        </Text>
        <Text
          style={[
            styles.itemSecondText,
            returnTypeOfTrainingStyle(data.trainingType),
          ]}>
          {data.trainingType.toUpperCase()}
        </Text>
      </View>
      <View style={[styles.itemCommonStyles, styles.itemSecondBlock]}>
        <Text style={styles.itemText}>{showClientName(data)}</Text>
      </View>
      <View style={[styles.itemCommonStyles, styles.itemThirdBlock]}>
        <Text style={styles.itemTimeText}>
          {`${data.trainingDate.time[0]} - ${data.trainingDate.time[1]}`}
        </Text>
        <View style={styles.itemStatusBlock}>
          {statusIcon}
          <Text style={[styles.itemText, statusStyle]}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: '100%',
    height: 80,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#232929',
  },
  itemCommonStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemFirstText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  itemSecondText: {
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingTop: 5,
    paddingBottom: 3,
    lineHeight: 10,
    borderRadius: 30,
  },
  itemText: {
    color: 'white',
    lineHeight: 13,
    fontSize: 11,
  },
  itemTimeText: {
    color: '#A1A1A1',
    lineHeight: 13,
    fontSize: 11,
  },
  itemSecondBlock: {
    marginTop: 4,
  },
  itemThirdBlock: {
    marginTop: 8,
  },
  itemStatusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
