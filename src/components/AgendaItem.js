import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {Swipeable} from 'react-native-gesture-handler';
import {SwipeableRightButtons} from './SwipeableRightButtons';
import {SvgCancelIcon} from '../assets/calendarIcons/SvgCancelIcon';
import {RemoveModal} from './RemoveModal';
import {useDispatch} from 'react-redux';
import {removeWorkoutPlanItem} from '../redux/action';

export const AgendaItem = ({item, currentTime, training}) => {
  const swipeableRef = useRef(null);
  const dispatch = useDispatch();
  const [isCancelActive, setIsCancelActive] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  useEffect(() => {
    swipeableRef.current?.close();
  }, [isCancelActive]);

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

  const returnDataDependsOnCencel = (item_1, item_2) => {
    return !isCancelActive ? item_1 : item_2;
  };

  const handleCancelBtn = () => {
    setIsCancelActive(!isCancelActive);
  };

  const handleDeleteBtn = () => {
    setRemoveModalVisible(true);
  };

  const handleConfirmRemovePress = () => {
    const selectedDate = item.trainings[0].trainingDate.date;
    const itemId = training.id;

    dispatch(removeWorkoutPlanItem([itemId, selectedDate]));
    setRemoveModalVisible(false);
  };

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() =>
          SwipeableRightButtons(
            isCancelActive,
            handleCancelBtn,
            handleDeleteBtn,
          )
        }>
        <View
          style={[
            styles.item,
            returnDataDependsOnCencel(styles.activeItem, styles.canceledItem),
          ]}>
          <View style={styles.itemCommonStyles}>
            <Text style={styles.itemFirstText}>
              {returnTrainingName(training.trainingName)}
            </Text>
            <Text
              style={[
                styles.itemSecondText,
                returnDataDependsOnCencel(
                  returnTypeOfTrainingStyle(training.trainingType),
                  styles.cancelBackground,
                ),
              ]}>
              {training.trainingType.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.itemCommonStyles, styles.itemSecondBlock]}>
            <Text style={styles.itemText}>{showClientName(training)}</Text>
          </View>
          <View style={[styles.itemCommonStyles, styles.itemThirdBlock]}>
            <Text style={styles.itemTimeText}>
              {`${training.trainingDate.time[0]} - ${training.trainingDate.time[1]}`}
            </Text>
            <View style={styles.itemStatusBlock}>
              {returnDataDependsOnCencel(statusIcon, <SvgCancelIcon />)}
              <Text
                style={[
                  styles.itemText,
                  returnDataDependsOnCencel(statusStyle, styles.cancelTitle),
                ]}>
                {returnDataDependsOnCencel(status, 'Відмінено')}
              </Text>
            </View>
          </View>
        </View>
      </Swipeable>

      <RemoveModal
        visible={removeModalVisible}
        hideModal={() => setRemoveModalVisible(false)}
        handleRemove={handleConfirmRemovePress}
        headerTitle={'Видалити заплановане тренування?'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: '100%',
    height: 80,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 12,
  },
  activeItem: {
    backgroundColor: '#232929',
  },
  canceledItem: {
    backgroundColor: 'rgb(33, 25, 25)',
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
    gap: 3,
  },
  cancelBackground: {
    backgroundColor: '#B95151',
  },
  cancelTitle: {
    color: '#B95151',
  },
});
