import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AgendaTimeLine} from './AgendaTimeLine';
import {AgendaItem} from './AgendaItem';

const AgendaItemBlockComponent = ({item}) => {
  const [currentTime, setCurrentTime] = useState(null);
  const [itemHeight, setItemHeight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const returnTimeString = () => {
        return `${date.getHours()}:${
          date.getMinutes().toString().length < 2
            ? `0${date.getMinutes()}`
            : date.getMinutes()
        }`;
      };
      setCurrentTime(returnTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentTimeArr = useMemo(
    () => currentTime?.split(':') || ['00', '00'],
    [currentTime],
  );

  const onLayout = event => {
    const height = event.nativeEvent.layout.height;
    if (height !== itemHeight) {
      setItemHeight(height);
    }
  };

  const renderTimeLine = timeId => {
    const [hour, minute] = timeId.split(':').map(Number);

    if (
      +currentTimeArr[0] >= hour &&
      +currentTimeArr[0] < hour + 1 &&
      itemHeight > 0
    ) {
      const lineTopNumber = (itemHeight / 60) * Number(currentTimeArr[1]);
      return (
        <AgendaTimeLine
          lineTopNumber={lineTopNumber}
          currentTime={currentTime}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.itemContainer} onLayout={onLayout}>
      <View style={styles.itemContainerHeader}>
        <Text style={styles.timeId}>{item.timeId}</Text>
        <View style={styles.borderLine} />
      </View>

      {renderTimeLine(item.timeId)}

      <View style={styles.itemBlock}>
        {item.trainings?.map(el => (
          <AgendaItem
            data={el}
            item={item}
            currentTime={currentTime}
            key={el.id}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    position: 'relative',
    width: '100%',
    minHeight: 80,
  },
  itemContainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeId: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  borderLine: {
    width: '100%',
    borderTopWidth: 1,
    marginLeft: 12,
    borderColor: '#303030',
  },
  itemBlock: {
    width: '100%',
    paddingRight: 20,
    paddingLeft: 43,
    gap: 8,
  },
});

export const AgendaItemBlock = React.memo(AgendaItemBlockComponent);
