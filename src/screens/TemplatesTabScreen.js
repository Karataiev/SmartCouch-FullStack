import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TemplateItem} from '../components/TemplateItem';
import {LayoutComponent} from '../components/LayoutComponent';

export const TemplatesTabScreen = ({navigation}) => {
  const handleClick = screen => {
    navigation.navigate(screen);
  };

  return (
    <LayoutComponent>
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
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 52,
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
