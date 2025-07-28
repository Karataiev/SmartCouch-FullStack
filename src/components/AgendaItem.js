import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {StyleSheet, Text, View} from 'react-native';
import {AgendaTimeLine} from './AgendaTimeLine';

const AgendaItemComponent = ({item}) => {
  const [itemHeight, setItemHeight] = useState(null);

  const currentTime = useSelector(state => state.currentTime);
  const currentTimeArr = currentTime?.split(':') || [];
  const timeIdArr = item?.timeId?.split(':') || ['00', '00'];

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
    return type === 'personal'
      ? {backgroundColor: '#00704F'}
      : {backgroundColor: '#4195B9'};
  };

  const renderTimeLine = timeId => {
    if (!timeId) return null;

    const timeIdArray = timeId.split(':');
    if (
      +currentTimeArr[0] >= +timeIdArray[0] &&
      +currentTimeArr[0] < +timeIdArray[0] + 1
    ) {
      const lineTopNumber = (+itemHeight / 60) * +currentTimeArr[1];
      return <AgendaTimeLine lineTopNumber={lineTopNumber} />;
    }

    return null;
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
                <Text style={styles.itemFirstText}>{el.trainingName}</Text>
                <Text
                  style={[
                    styles.itemSecondText,
                    returnTypeOfTrainingStyle(el.trainingType),
                  ]}>
                  {el.trainingType.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.itemCommonStyles, styles.itemSecondBlock]}>
                <Text style={styles.itemText}>
                  {`${el.client.client.name} ${el.client.client.surname}`.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.itemCommonStyles, styles.itemThirdBlock]}>
                <Text style={styles.itemTimeText}>
                  {`${el.oneTimeTrainingDate.time[0]} - ${el.oneTimeTrainingDate.time[1]}`}
                </Text>
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
    minHeight: 80,
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
    backgroundColor: '#232929',
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
