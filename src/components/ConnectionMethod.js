import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SvgInstagram} from '../assets/svgIcons/SvgInstagram';
import {SvgTelegram} from '../assets/svgIcons/SvgTelegram';
import {SvgViber} from '../assets/svgIcons/SvgViber';
import {SvgWhatsapp} from '../assets/svgIcons/SvgWhatsapp';

const renderIcon = title => {
  switch (title) {
    case 'Instagram':
      return <SvgInstagram />;
    case 'Telegram':
      return <SvgTelegram />;
    case 'Viber':
      return <SvgViber />;
    case 'WhatsApp':
      return <SvgWhatsapp />;
    default:
      return null;
  }
};

export const ConnectionMethod = ({title, handleConnectionMethod}) => {
  return (
    <TouchableOpacity
      style={styles.typeOfConnection}
      onPress={() => handleConnectionMethod(title)}>
      {renderIcon(title)}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  typeOfConnection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    backgroundColor: '#3D3D3D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
  },
});
