import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgDoneStatus} from '../assets/calendarIcons/SvgDoneStatus';
import {SvgWaitingStatus} from '../assets/calendarIcons/SvgWaitingStatus';
import {SvgInProgressStatus} from '../assets/calendarIcons/SvgInProgressStatus';
import {Swipeable} from 'react-native-gesture-handler';
import {SwipeableRightButtons} from './SwipeableRightButtons';
import {SvgCancelIcon} from '../assets/calendarIcons/SvgCancelIcon';
import {RemoveModal} from './RemoveModal';
import {useDispatch} from 'react-redux';
import {removeWorkoutPlanItem, toggleTrainingOccurrenceCancel} from '../redux/action';
import {useToast} from '../castomHooks/useToast';

const AgendaItemComponent = ({item, currentTime, training}) => {
  const swipeableRef = useRef(null);
  const dispatch = useDispatch();
  const {showToast} = useToast();
  const isCancelActive = training?.isCanceled || false;
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

  const trainingName = training?.trainingName || 'Gym';
  const trainingTypeLabel = training?.trainingType?.toUpperCase() || 'TRAINING';
  const isPersonalTraining = training?.trainingType === 'personal';
  const trainingTimes = training?.trainingDate?.time ?? [];

  const clientTitle = useMemo(() => {
    if (!training?.client) {
      return isPersonalTraining
        ? 'УТОЧНИТИ ДАНІ КЛІЄНТА'
        : 'ГРУПОВЕ ТРЕНУВАННЯ';
    }
    return `${training.client?.client.name} ${
      training.client?.client.surname
    }`.toUpperCase();
  }, [training, isPersonalTraining]);

  const trainingTimeRange = useMemo(() => {
    const [start = '--:--', end = '--:--'] = trainingTimes;
    return `${start} - ${end}`;
  }, [trainingTimes]);

  const firstTrainingDate = useMemo(
    () => item.trainings?.[0]?.trainingDate?.date,
    [item.trainings],
  );

  const handleCancelBtn = useCallback(() => {
    if (training?.occurrenceId && training?.id) {
      dispatch(
        toggleTrainingOccurrenceCancel({
          trainingId: training.id,
          occurrenceId: training.occurrenceId,
        }),
      );
    }
  }, [dispatch, training?.id, training?.occurrenceId]);

  const handleDeleteBtn = useCallback(() => {
    setRemoveModalVisible(true);
  }, []);

  const hideRemoveModal = useCallback(() => {
    setRemoveModalVisible(false);
  }, []);

  const handleConfirmRemovePress = useCallback(() => {
    if (!firstTrainingDate) {
      return;
    }
    dispatch(removeWorkoutPlanItem([training.id, firstTrainingDate]));
    showToast('Заплановане тренування видалено');
    setRemoveModalVisible(false);
  }, [dispatch, training.id, firstTrainingDate, showToast]);

  const renderRightActions = useCallback(
    () =>
      SwipeableRightButtons(isCancelActive, handleCancelBtn, handleDeleteBtn),
    [isCancelActive, handleCancelBtn, handleDeleteBtn],
  );

  const trainingStatusIcon = isCancelActive ? <SvgCancelIcon /> : statusIcon;
  const trainingStatusText = isCancelActive ? 'Відмінено' : status;
  const trainingStatusStyle = isCancelActive ? styles.cancelTitle : statusStyle;
  const trainingTypeStyle = isCancelActive
    ? styles.cancelBackground
    : isPersonalTraining
    ? styles.personalTrainingType
    : styles.groupTrainingType;
  const itemContainerStyle = isCancelActive
    ? styles.canceledItem
    : styles.activeItem;

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}>
        <View
          style={[
            styles.item,
            itemContainerStyle,
          ]}>
          <View style={styles.itemCommonStyles}>
            <Text style={styles.itemFirstText}>{trainingName}</Text>
            <Text
              style={[
                styles.itemSecondText,
                trainingTypeStyle,
              ]}>
              {trainingTypeLabel}
            </Text>
          </View>
          <View style={[styles.itemCommonStyles, styles.itemSecondBlock]}>
            <Text style={styles.itemText}>{clientTitle}</Text>
          </View>
          <View style={[styles.itemCommonStyles, styles.itemThirdBlock]}>
            <Text style={styles.itemTimeText}>
              {trainingTimeRange}
            </Text>
            <View style={styles.itemStatusBlock}>
              {trainingStatusIcon}
              <Text style={[styles.itemText, trainingStatusStyle]}>
                {trainingStatusText}
              </Text>
            </View>
          </View>
        </View>
      </Swipeable>

      <RemoveModal
        visible={removeModalVisible}
        hideModal={hideRemoveModal}
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
  personalTrainingType: {
    backgroundColor: '#00704F',
  },
  groupTrainingType: {
    backgroundColor: '#4195B9',
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

export const AgendaItem = React.memo(AgendaItemComponent);
