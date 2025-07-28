import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';
import {SvgArrowRightYellow} from '../assets/svgIcons/SvgArrowRightYellow';

export const ProfileMenuItem = ({title, icon, subscription, navigation}) => {
  const handleClick = btn => {
    switch (btn) {
      case 'Мої дані':
        navigation.navigate('MyData');
        break;
      case 'Аналітика':
        navigation.navigate('Analytics');
        break;
      case 'Підписка':
        navigation.navigate('Subscribe');
        break;
      case 'Підтримка':
        navigation.navigate('Help');
        break;
      case 'Про нас':
        navigation.navigate('AboutUs');
        break;

      default:
        break;
    }
  };

  return (
    <TouchableOpacity onPress={() => handleClick(title)}>
      {title === 'Підписка' ? (
        <ImageBackground
          source={require('../assets/pngIcons/subscribeBtnIcon.png')}
          resizeMode="cover"
          imageStyle={{borderRadius: 10}}
          style={[styles.profileMenuItem, {backgroundColor: '#232929'}]}>
          <View style={styles.profileMenuTitleSubscriptionBlock}>
            {icon}
            <Text style={styles.profileMenuItemTitle}>{title}</Text>
            {subscription && (
              <Text style={styles.subscription}>{subscription}</Text>
            )}
          </View>
          <SvgArrowRightYellow />
        </ImageBackground>
      ) : (
        <View style={styles.profileMenuItem}>
          <View style={styles.profileMenuTitleBlock}>
            {icon}
            <Text style={styles.profileMenuItemTitle}>{title}</Text>
            {subscription && (
              <Text style={styles.subscription}>{subscription}</Text>
            )}
          </View>
          <SvgArrowRight />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileMenuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#232929',
  },
  profileMenuTitleBlock: {
    display: 'flex',
    flexDirection: 'row',
    gap: 11,
  },
  profileMenuTitleSubscriptionBlock: {
    display: 'flex',
    gap: 2,
  },
  profileMenuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
  },
  subscription: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: '#3EB1CC',
  },
});
