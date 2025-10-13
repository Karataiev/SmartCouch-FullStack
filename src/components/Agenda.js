import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {AgendaItem} from './AgendaItem';
import {useSelector} from 'react-redux';
import {useConvertDate} from '../castomHooks/useConvertDate';

export const Agenda = ({date}) => {
  const workoutPlanArr = useSelector(state => state.workoutPlanArr);
  const [filteredArr, setFilteredArr] = useState(workoutPlanArr);
  const {convertUkrDateToISO} = useConvertDate();

  useEffect(() => {
    const newWorkoutPlanArr = workoutPlanArr
      .map(plan => {
        const filteredTrainings = plan.trainings.filter(
          tr => convertUkrDateToISO(tr.trainingDate.date) === date,
        );

        return {
          ...plan,
          trainings: filteredTrainings,
        };
      })
      .filter(plan => !!plan.timeId);

    setFilteredArr(newWorkoutPlanArr);
  }, [workoutPlanArr, date]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredArr}
        renderItem={({item}) => <AgendaItem item={item} />}
        keyExtractor={(item, index) => `${item.timeId}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
  },
});
