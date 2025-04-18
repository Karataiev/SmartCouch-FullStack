import {StyleSheet, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';

export const ExercisesScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation}>
        Вправи
      </HeaderWithBackButton>
    </View>
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
});
