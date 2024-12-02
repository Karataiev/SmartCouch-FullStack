import {StyleSheet, Text, View} from 'react-native';
import {SvgMyData} from '../assets/ProfileIcons/SvgMyData';
import {SvgAnalytics} from '../assets/ProfileIcons/SvgAnalytics';
import {ProfileMenuItem} from './ProfileMenuItem';

const profileMenuItemsData = [
  {
    title: 'Мої дані',
    icon: <SvgMyData />,
  },
  {
    title: 'Аналітика',
    icon: <SvgAnalytics />,
  },
  {
    title: 'Підписка',
    icon: '',
    subscription: 'Basic',
  },
  {
    title: 'Підтримка',
    icon: '',
  },
  {
    title: 'Про нас',
    icon: '',
  },
];

export const ProfileMenuComponent = ({navigation}) => {
  return (
    <View style={styles.container}>
      {profileMenuItemsData.map(item => (
        <ProfileMenuItem
          title={item.title}
          icon={item.icon}
          subscription={item.subscription || false}
          key={item.title}
          navigation={navigation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 65,
  },
});
