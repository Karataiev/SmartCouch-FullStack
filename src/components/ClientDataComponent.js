import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const ClientDataComponent = ({itemData}) => {
  const client = itemData.client;
  const connectionMethods = itemData.client.link;
  const clientsCharacteristics = itemData.clientsCharacteristics;

  const clientSecondaryInfo = [
    {
      title: 'Цілі та основні побажання',
      data: clientsCharacteristics?.targetAndWishes || '-',
    },
    {
      title: 'Стан здоровʼя (травми / протипоказання)',
      data: clientsCharacteristics?.stateOfHealth || '-',
    },
    {
      title: 'Рівень фізичної підготовки',
      data: clientsCharacteristics?.levelOfPhysical || '-',
    },
    {title: 'Замітки', data: clientsCharacteristics?.notes || '-'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.content}>
        {client.name} {client.surname}
      </Text>
      <Text style={styles.content}> {client.number}</Text>
      {!!connectionMethods &&
        connectionMethods.map(
          (el, id) =>
            el.link !== '' && (
              <View style={styles.contentBlock} key={id}>
                <Text style={styles.title}>{el.type}</Text>
                <Text style={styles.content}>{el.link}</Text>
              </View>
            ),
        )}

      {clientSecondaryInfo.map(el => (
        <View style={styles.contentBlock} key={el.title}>
          <Text style={styles.title}>{el.title}</Text>
          <Text style={styles.content}>{el.data}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 24,
    paddingBottom: 24,
    gap: 20,
  },
  content: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    color: 'white',
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#A1A1A1',
  },
});
