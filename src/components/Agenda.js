import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {agendaData} from '../mocks/agendaData';
import {AgendaItem} from './AgendaItem';

export const Agenda = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={agendaData}
        renderItem={({item}) => <AgendaItem item={item} />}
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
