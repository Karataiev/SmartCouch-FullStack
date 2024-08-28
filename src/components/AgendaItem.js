import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {AgendaTimeLine} from './AgendaTimeLine';

export const AgendaItem = ({item}) => {
  const [status, setStatus] = useState('');
  const [statusIcon, setStatusIcon] = useState(null);

  useEffect(() => {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();

    if (status === 'Проведено') return <SvgDoneStatus />;
    if (status === 'Триває') return <SvgInProgressStatus />;
    if (status === 'Очікується') return <SvgWaitingStatus />;
  }, []);

  const returnTypeOfTrainingStyle = type => {
    return type === 'PERSONAL'
      ? {backgroundColor: '#00704F'}
      : {backgroundColor: '#4195B9'};
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemContainerHeader}>
        <Text style={styles.timeId}>{item.timeId}</Text>
        <View style={styles.borderLine} />
      </View>

      <AgendaTimeLine />

      <View style={styles.itemBlock}>
        {item.trainings &&
          item.trainings.map((el, index) => (
            <View style={styles.item} key={index}>
              <View style={styles.itemCommonStyles}>
                <Text style={styles.itemFirstText}>{el.nameOfTraining}</Text>
                <Text
                  style={[
                    styles.itemSecondText,
                    returnTypeOfTrainingStyle(el.typeOfTraining),
                  ]}>
                  {el.typeOfTraining}
                </Text>
              </View>
              <View style={[styles.itemCommonStyles, styles.itemSecondBlock]}>
                <Text style={styles.itemText}>{el.nameOfClient}</Text>
              </View>
              <View style={[styles.itemCommonStyles, styles.itemThirdBlock]}>
                <Text style={styles.itemTimeText}>{el.timeOfTraining}</Text>
                {/*  */}
                <View style={styles.itemStatusBlock}>
                  {/* {returnIcon(el.status)} */}
                  <Text style={[styles.itemText, el.status === '']}>
                    {el.status}
                  </Text>
                </View>
                {/*  */}
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
  },
  itemContainerHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeId: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  borderLine: {
    width: '100%',
    borderTopWidth: 1,
    marginLeft: 12,
    borderBlockColor: '#303030',
  },
  itemBlock: {
    width: '100%',
    paddingRight: 20,
    paddingLeft: 43,
  },
  item: {
    width: '100%',
    height: 80,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#2E2E2E',
  },
  itemCommonStyles: {
    display: 'flex',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
});
