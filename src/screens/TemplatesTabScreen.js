import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TemplateItem} from '../components/TemplateItem';

export const TemplatesTabScreen = ({navigation}) => {
  const handleClick = screen => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Програми тренувань</Text>
      <View style={styles.mainContentBlock}>
        <TemplateItem handlePress={() => handleClick('MyPrograms')}>
          Мої програми тренувань
        </TemplateItem>
        <TemplateItem handlePress={() => handleClick('ReadyMadePrograms')}>
          Готові програми тренувань
        </TemplateItem>
        <TemplateItem handlePress={() => handleClick('Exercises')}>
          Вправи
        </TemplateItem>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
    paddingTop: 17,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  mainContentBlock: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 36,
    gap: 12,
  },
});
