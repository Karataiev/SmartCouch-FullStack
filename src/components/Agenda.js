import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AgendaItemBlock} from './AgendaItemBlock';
import {selectAgendaByDate} from '../redux/selectors/workoutPlanSelectors';

const AgendaComponent = ({date}) => {
  const filteredArr = useSelector(state => selectAgendaByDate(state, date));

  const renderItem = useCallback(
    ({item}) => <AgendaItemBlock item={item} />,
    [],
  );

  const keyExtractor = useCallback(item => item.timeId, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredArr}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export const Agenda = React.memo(AgendaComponent);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
  },
});
