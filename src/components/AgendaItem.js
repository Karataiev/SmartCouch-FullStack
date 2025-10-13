import React, {useEffect, useMemo, useState} from 'react';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {StyleSheet, Text, View} from 'react-native';
import {AgendaTimeLine} from './AgendaTimeLine';

const AgendaItemComponent = ({item}) => {
  const [currentTime, setCurrentTime] = useState(null);
  const [itemHeight, setItemHeight] = useState(0); // ✅ стан для висоти

  // ⏰ оновлення поточного часу
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const returnTimeString = () => {
        return `${date.getHours()}:${
          date.getMinutes().toString().length < 2
            ? `0${date.getMinutes()}`
            : date.getMinutes()
        }`;
      };
      setCurrentTime(returnTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentTimeArr = useMemo(
    () => currentTime?.split(':') || ['00', '00'],
    [currentTime],
  );

  const timeIdArr = useMemo(
    () => item?.timeId?.split(':') || ['00', '00'],
    [item?.timeId],
  );

  // 🟢 визначення статусу
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

  // 📏 вимірювання висоти після рендера
  const onLayout = event => {
    const height = event.nativeEvent.layout.height;
    if (height !== itemHeight) {
      setItemHeight(height);
    }
  };

  // 🎨 рендер лінії часу
  const renderTimeLine = timeId => {
    const [hour, minute] = timeId.split(':').map(Number);

    // лише якщо поточна година збігається
    if (
      +currentTimeArr[0] >= hour &&
      +currentTimeArr[0] < hour + 1 &&
      itemHeight > 0
    ) {
      const lineTopNumber = (itemHeight / 60) * Number(currentTimeArr[1]);
      return (
        <AgendaTimeLine
          lineTopNumber={lineTopNumber}
          currentTime={currentTime}
        />
      );
    }
    return null;
  };

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

  const returnTrainingName = name => (name ? name : 'Gym');

  return (
    <View style={styles.itemContainer} onLayout={onLayout}>
      <View style={styles.itemContainerHeader}>
        <Text style={styles.timeId}>{item.timeId}</Text>
        <View style={styles.borderLine} />
      </View>

      {renderTimeLine(item.timeId)}

      <View style={styles.itemBlock}>
        {item.trainings?.map((el, index) => (
          <View style={styles.item} key={index}>
            <View style={styles.itemCommonStyles}>
              <Text style={styles.itemFirstText}>
                {returnTrainingName(el.trainingName)}
              </Text>
              <Text
                style={[
                  styles.itemSecondText,
                  returnTypeOfTrainingStyle(el.trainingType),
                ]}>
                {el.trainingType.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.itemCommonStyles, styles.itemSecondBlock]}>
              <Text style={styles.itemText}>{showClientName(el)}</Text>
            </View>
            <View style={[styles.itemCommonStyles, styles.itemThirdBlock]}>
              <Text style={styles.itemTimeText}>
                {`${el.trainingDate.time[0]} - ${el.trainingDate.time[1]}`}
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
    borderColor: '#303030',
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

export const AgendaItem = React.memo(AgendaItemComponent);
