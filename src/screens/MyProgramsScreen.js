import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {useSelector} from 'react-redux';
import {ProgramItem} from '../components/ProgramItem';

export const MyProgramsScreen = ({navigation}) => {
  const programs = useSelector(state => state.programs);

  const onPressAdd = () => {
    navigation.navigate('CreateProgram');
  };

  const handleClickItem = el => {
    navigation.navigate('CurrentProgram', {itemData: el});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <HeaderWithBackButton
          navigation={navigation}
          addBtn={true}
          onPressAdd={onPressAdd}
          goPrograms={true}>
          Мої програми
        </HeaderWithBackButton>

        {programs.length !== 0 ? (
          <View style={[styles.mainContent, {marginTop: 12, gap: 8}]}>
            {programs.map(el => (
              <ProgramItem
                key={el.id}
                info={el}
                handleClick={() => handleClickItem(el)}
              />
            ))}
          </View>
        ) : (
          <View style={[styles.mainContent, {marginTop: 72}]}>
            <View style={styles.programsLogoContainer}>
              <Image
                style={styles.programsLogo}
                source={require('../assets/pngIcons/emptyProgramsPNG.png')}
              />
            </View>
            <Text style={styles.programsEmptyMainText}>
              У вас ще немає програм тренувань
            </Text>
            <Text style={styles.programsEmptySecondaryText}>
              Створіть програму
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  mainContent: {
    width: '100%',
    marginTop: 80,
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
    maxWidth: 80,
    maxHeight: 80,
  },
  programsEmptyMainText: {
    paddingTop: 20,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  programsEmptySecondaryText: {
    paddingTop: 8,
    fontSize: 15,
    lineHeight: 20,
    color: '#A1A1A1',
  },
});
