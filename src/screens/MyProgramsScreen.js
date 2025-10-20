import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {useSelector} from 'react-redux';
import {ProgramItem} from '../components/ProgramItem';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const MyProgramsScreen = ({navigation}) => {
  const programs = useSelector(state => state.programs);

  const onPressAdd = () => {
    navigation.navigate('CreateProgram');
  };

  const handleClickItem = el => {
    navigation.navigate('CurrentProgram', {itemData: el});
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.programsLogoContainer}>
        <Image
          style={styles.programsLogo}
          source={require('../assets/pngIcons/emptyProgramsPNG.png')}
        />
      </View>
      <Text style={styles.programsEmptyMainText}>
        У вас ще немає програм тренувань
      </Text>
      <Text style={styles.programsEmptySecondaryText}>Створіть програму</Text>
    </View>
  );

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton
          navigation={navigation}
          addBtn={true}
          onPressAdd={onPressAdd}
          goPrograms={true}>
          Мої програми
        </HeaderWithBackButton>

        <FlatList
          data={programs}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ProgramItem
              info={item}
              handleClick={() => handleClickItem(item)}
            />
          )}
          contentContainerStyle={
            programs.length === 0 ? styles.emptyListContent : styles.listContent
          }
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
          ListEmptyComponent={renderEmptyList}
        />
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 72,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  programsLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
    width: 160,
    height: 160,
    borderRadius: 16,
  },
  programsLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  programsEmptyMainText: {
    paddingTop: 20,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  programsEmptySecondaryText: {
    paddingTop: 8,
    fontSize: 15,
    lineHeight: 20,
    color: '#A1A1A1',
    textAlign: 'center',
  },
});
