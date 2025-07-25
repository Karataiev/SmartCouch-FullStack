import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {AgendaItem} from './AgendaItem';
import {useSelector} from 'react-redux';

export const Agenda = () => {
  const workoutPlanArr = useSelector(state => state.workoutPlanArr);
  return (
    <View style={styles.container}>
      <FlatList
        data={workoutPlanArr}
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
