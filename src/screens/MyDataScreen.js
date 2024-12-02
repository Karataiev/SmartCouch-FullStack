import {StyleSheet, View} from 'react-native';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {MyDataComponent} from '../components/MyDataComponent';

export const MyDataScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation}>
        Мої дані
      </HeaderWithBackButton>

      <MyDataComponent navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
