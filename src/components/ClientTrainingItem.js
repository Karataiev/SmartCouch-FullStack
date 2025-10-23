import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useConvertDatesToDays} from '../castomHooks/useConvertDaysToDates';
import {Swipeable} from 'react-native-gesture-handler';
import {SwipeableDeleteButton} from './SwipableDeleteButton';
import {useDispatch} from 'react-redux';
import {removeClientWorkoutPlanItem} from '../redux/action';
import {RemoveModal} from './RemoveModal';

export const ClientTrainingItem = ({itemData, itemId}) => {
  const dispatch = useDispatch();
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const {convertToDayOfWeek} = useConvertDatesToDays();

  const trainingName = !itemData[0].trainingName
    ? 'Gym'
    : itemData[0].trainingName;
  const trainingType = itemData[0].trainingType.toUpperCase();

  const uniqueDays = useMemo(() => {
    const seen = new Set();
    const result = [];

    itemData.forEach(item => {
      const dayName = convertToDayOfWeek(item.trainingDate.date);
      if (!seen.has(dayName)) {
        seen.add(dayName);
        result.push({
          day: dayName,
          time: item.trainingDate.time,
        });
      }
    });

    return result;
  }, [itemData, convertToDayOfWeek]);

  const handleDeleteBtn = () => {
    setRemoveModalVisible(true);
  };

  const handleConfirmRemovePress = () => {
    dispatch(removeClientWorkoutPlanItem(itemId));
    setRemoveModalVisible(false);
  };

  return (
    <>
      <Swipeable
        renderRightActions={() => SwipeableDeleteButton(handleDeleteBtn)}>
        {itemData.length === 1 ? (
          <View style={styles.itemContainer}>
            <View style={styles.itemBlockStyles}>
              <Text style={styles.itemNameText}>{trainingName}</Text>
              <Text style={styles.itemTypeText}>{trainingType}</Text>
            </View>
            <View style={styles.itemBlockStyles}>
              <Text style={styles.itemDataText}>
                {itemData[0].trainingDate.date}
              </Text>
              <View style={styles.middleLine} />
              <Text style={styles.itemTimeText}>
                {`${itemData[0].trainingDate.time[0]} - ${itemData[0].trainingDate.time[1]}`}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.itemContainer}>
            <View style={styles.itemBlockStyles}>
              <Text style={styles.itemNameText}>{trainingName}</Text>
              <Text style={styles.itemTypeText}>{trainingType}</Text>
            </View>

            <View style={styles.itemDatesListBlock}>
              {uniqueDays.map(item => (
                <View style={styles.itemBlockStyles} key={item.day}>
                  <Text style={styles.itemDataText}>{item.day}</Text>
                  <View style={styles.middleLine} />
                  <Text style={styles.itemTimeText}>
                    {`${item.time[0]} - ${item.time[1]}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
  itemContainer: {
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#232929',
  },
  itemBlockStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDatesListBlock: {
    marginTop: 12,
    gap: 8,
  },
  itemNameText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  itemTypeText: {
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingTop: 5,
    paddingBottom: 3,
    lineHeight: 10,
    borderRadius: 30,
    backgroundColor: '#00704F',
  },
  itemTimeText: {
    color: '#A1A1A1',
    lineHeight: 13,
    fontSize: 13,
  },
  itemDataText: {
    width: '33%',
    color: 'white',
    lineHeight: 13,
    fontSize: 13,
  },
  middleLine: {
    width: '30%',
    borderColor: '#65E3FF',
    borderTopWidth: 0.5,
    height: 0,
  },
});
