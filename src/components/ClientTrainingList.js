import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {ClientTrainingItem} from './ClientTrainingItem';
import {selectClientTrainingCards} from '../redux/selectors/workoutPlanSelectors';

export const ClientTrainingList = ({clientId}) => {
  const clientTrainingsArr = useSelector(state =>
    selectClientTrainingCards(state, clientId),
  );

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
