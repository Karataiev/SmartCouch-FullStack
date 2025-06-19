import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {AgendaTimeLine} from './AgendaTimeLine';
import {useSelector} from 'react-redux';

const AgendaItemComponent = ({item}) => {
  const [itemHeight, setItemHeight] = useState();

  const currentTime = useSelector(state => state.currentTime);
  const currentTimeArr = currentTime?.split(':') || [];
  const timeIdArr = item.timeId.split(':') || [];

  let status = '';
  let statusIcon = null;
  let statusStyle = {};

  if (currentTimeArr[0] > timeIdArr[0]) {
    status = 'Проведено';
    statusIcon = <SvgDoneStatus />;
    statusStyle = {color: '#00CA8D'};
  } else if (currentTimeArr[0] < timeIdArr[0]) {
    status = 'Очікується';
    statusIcon = <SvgWaitingStatus />;
    statusStyle = {color: '#FFFFFF'};
  } else {
    status = 'Триває';
    statusIcon = <SvgInProgressStatus />;
    statusStyle = {color: '#F79605'};
  }

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    setItemHeight(height);
  };

  const returnTypeOfTrainingStyle = type => {
    return type === 'PERSONAL'
      ? {backgroundColor: '#00704F'}
      : {backgroundColor: '#4195B9'};
  };

  const renderTimeLine = timeId => {
    const timeIdArray = timeId.split(':');
    if (
      +currentTimeArr[0] >= +timeIdArray[0] &&
      +currentTimeArr[0] < +timeIdArray[0] + 1
    ) {
      const lineTopNumber = (+itemHeight / 60) * +currentTimeArr[1];
      return <AgendaTimeLine lineTopNumber={lineTopNumber} />;
    }
  };

  return (
    <View style={styles.itemContainer} onLayout={onLayout}>
      <View style={styles.itemContainerHeader}>
        <Text style={styles.timeId}>{item.timeId}</Text>
        <View style={styles.borderLine} />
      </View>

      {renderTimeLine(item.timeId)}

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
                <View style={styles.itemStatusBlock}>
                  {statusIcon}
                  <Text style={[styles.itemText, statusStyle]}>{status}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    position: 'relative',
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
    gap: 8,
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

export const AgendaItem = React.memo(AgendaItemComponent);
