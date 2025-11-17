import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientTrainingItem} from './ClientTrainingItem';

export const ClientTrainingList = ({clientId}) => {
  const workoutPlanArr = useSelector(state => state.app.workoutPlanArr);
  const [clientTrainingsArr, setClientTrainingsArr] = useState([]);

  const splitTrainingsById = trainings => {
    const idCount = {};

    trainings.forEach(item => {
      idCount[item.id] = (idCount[item.id] || 0) + 1;
    });

    const uniqueTrainings = [];
    const duplicateTrainings = [];

    Object.keys(idCount).forEach(id => {
      const group = trainings.filter(t => t.id === id);
      if (idCount[id] === 1) {
        uniqueTrainings.push(group[0]);
      } else {
        duplicateTrainings.push(group);
      }
    });

    return {uniqueTrainings, duplicateTrainings};
  };

  useEffect(() => {
    if (!workoutPlanArr?.length) {
      setClientTrainingsArr([]);
      return;
    }

    const filteredTrainings = workoutPlanArr.flatMap(plan =>
      plan.trainings.filter(item => item.client.id === clientId),
    );

    const {uniqueTrainings, duplicateTrainings} =
      splitTrainingsById(filteredTrainings);

    const finalCards = [
      ...uniqueTrainings.map(t => ({
        key: t.id,
        trainings: [t],
      })),
      ...duplicateTrainings.map(group => ({
        key: group[0].id,
        trainings: group,
      })),
    ];

    setClientTrainingsArr(finalCards);
  }, [workoutPlanArr, clientId]);

  return (
    <View style={styles.container}>
      {clientTrainingsArr.length > 0 ? (
        <FlatList
          data={clientTrainingsArr}
          renderItem={({item}) => (
            <ClientTrainingItem itemData={item.trainings} itemId={item.key} />
          )}
          keyExtractor={item => item.key}
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
        />
      ) : (
        <Text style={styles.noTrainings}>
          У клієнта ще немає запланованих тренувань
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noTrainings: {
    marginTop: 24,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: '#D1D1D1',
    textAlign: 'center',
  },
});
