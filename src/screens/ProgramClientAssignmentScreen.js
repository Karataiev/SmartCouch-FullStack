import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {CheckboxComponent} from '../components/CheckboxComponent';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {updateClientProgram} from '../redux/action';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const ProgramClientAssignmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const originWay = route.params?.origin || 'MyPrograms';

  const dispatch = useDispatch();
  const myProgramList = useSelector(state => state.programs);
  const readyMadeProgramsList = useSelector(state => state.programs);

  const [programsArr, setProgramsArr] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  useEffect(() => {
    const source =
      originWay === 'MyPrograms' ? myProgramList : readyMadeProgramsList;
    setProgramsArr(source || []);
  }, [originWay, myProgramList, readyMadeProgramsList]);

  const returnHeaderName = () => {
    return originWay === 'MyPrograms' ? 'Мої програми' : 'Готові програми';
  };

  const handleSelect = id => {
    setSelectedProgramId(prev => (prev === id ? null : id));
  };

  const handleSubmit = () => {
    if (!selectedProgramId) return;

    const selectedProgram = programsArr.find(p => p.id === selectedProgramId);
    if (!selectedProgram) return;

    dispatch(
      updateClientProgram({
        clientId: route.params?.clientId,
        programInfo: selectedProgram,
      }),
    );

    navigation.pop(2);
  };

  const onPressAdd = () => {
    navigation.navigate('CreateProgram', {
      origin: originWay,
      clientId: route.params?.clientId,
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleSelect(item.id)}
      style={styles.itemContainer}>
      <CheckboxComponent pinned={item.id === selectedProgramId} />
      <Text style={styles.programTitle}>{item.title || 'Без назви'}</Text>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.mainContent}>
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
          addBtn={programsArr.length === 0}
          onPressAdd={onPressAdd}
          goPrograms>
          {returnHeaderName()}
        </HeaderWithBackButton>

        <View style={styles.contentContainer}>
          <FlatList
            data={programsArr}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{height: 12}} />}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={
              programsArr.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
          />
        </View>

        {programsArr.length !== 0 && (
          <SafeInfoButton
            disabled={!selectedProgramId}
            handleSubmit={handleSubmit}>
            Закріпити
          </SafeInfoButton>
        )}
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
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 72,
  },
  mainContent: {
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232929',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  programTitle: {
    marginLeft: 12,
    fontSize: 16,
    color: 'white',
  },
});
