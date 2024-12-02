import {StyleSheet, View} from 'react-native';
import {ProfileHeaderComponent} from '../components/ProfileHeaderComponent';
import {ProfileMenuComponent} from '../components/ProfileMenuComponent';

export const ProfileTabScreen = ({navigation}) => {
  return (
    <View style={styles.profileContainer}>
      <ProfileHeaderComponent />
      <ProfileMenuComponent navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
  },
});
