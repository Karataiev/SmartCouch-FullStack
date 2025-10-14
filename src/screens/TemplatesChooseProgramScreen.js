import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SvgBackBtn} from '../assets/svgIcons/SvgBackBtn';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TemplateItem} from '../components/TemplateItem';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const TemplatesChooseProgramScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleBackBtn = () => {
    navigation.goBack();
  };

  const handlePressFolder = origin => {
    navigation.navigate('ProgramClientAssignment', {
      origin: origin,
      clientId: route.params?.clientId,
    });
  };

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
            <SvgBackBtn />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Програми</Text>
        </View>
        <View style={styles.mainContentBlock}>
          <TemplateItem handlePress={() => handlePressFolder('MyPrograms')}>
            Мої програми тренувань
          </TemplateItem>
          <TemplateItem
            handlePress={() => handlePressFolder('ReadyMadePrograms')}>
            Готові програми тренувань
          </TemplateItem>
        </View>
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 100,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainContentBlock: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 27,
    gap: 12,
  },
});
