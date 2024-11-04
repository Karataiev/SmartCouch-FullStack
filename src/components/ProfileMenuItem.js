import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';
import {SvgArrowRightYellow} from '../assets/svgIcons/SvgArrowRightYellow';

export const ProfileMenuItem = ({title, icon, subscription}) => {
  return (
    <TouchableOpacity
      style={[
        styles.profileMenuItem,
        title === 'Підписка' && styles.profileMenuItemSubscribe,
      ]}>
      <View
        style={
          title === 'Підписка'
            ? styles.profileMenuTitleSubscriptionBlock
            : styles.profileMenuTitleBlock
        }>
        {icon}
        <Text style={styles.profileMenuItemTitle}>{title}</Text>
        {subscription && (
          <Text style={styles.subscription}>{subscription}</Text>
        )}
      </View>
      {title !== 'Підписка' ? <SvgArrowRight /> : <SvgArrowRightYellow />}
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
    width: '100%',
    backgroundColor: '#2E2E2E',
  },
  profileMenuItemSubscribe: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#2E2E2E',
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
    color: '#FFFF65',
  },
});
