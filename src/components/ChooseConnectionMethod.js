import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {SvgRemoveItem} from '../assets/svgIcons/SvgRemoveItem';
import {useEffect, useState} from 'react';
import {SvgInstagram} from '../assets/svgIcons/SvgInstagram';
import {SvgTelegram} from '../assets/svgIcons/SvgTelegram';
import {SvgViber} from '../assets/svgIcons/SvgViber';
import {SvgWhatsapp} from '../assets/svgIcons/SvgWhatsapp';

export const ChooseConnectionMethod = ({el, setLinks, handleRemoveBtn}) => {
  const [connectionMethodsLink, setConnectionMethodsLink] = useState('');
  const [setInstagramLink, setViberLink, setTelegramLink, setWhatsAppLink] =
    setLinks;

  useEffect(() => {
    switch (el.type) {
      case 'Instagram':
        setInstagramLink({
          type: el.type,
          link: connectionMethodsLink,
          icon: <SvgInstagram />,
        });
        break;
      case 'Telegram':
        setTelegramLink({
          type: el.type,
          link: connectionMethodsLink,
          icon: <SvgTelegram />,
        });
        break;
      case 'Viber':
        setViberLink({
          type: el.type,
          link: connectionMethodsLink,
          icon: <SvgViber />,
        });
        break;
      case 'WhatsApp':
        setWhatsAppLink({
          type: el.type,
          link: connectionMethodsLink,
          icon: <SvgWhatsapp />,
        });
        break;

      default:
        break;
    }
  }, [connectionMethodsLink]);

  return (
    <View style={styles.connectionInputBlock}>
      <View style={styles.connectionIcon}>{el.icon}</View>
      <TextInput
        value={connectionMethodsLink}
        onChangeText={setConnectionMethodsLink}
        style={styles.connectionInput}
        placeholder="Посилання на профіль"
        placeholderTextColor={'#A1A1A1'}
      />
      <TouchableOpacity onPress={() => handleRemoveBtn(el.type)}>
        <SvgRemoveItem />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  connectionInputBlock: {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  connectionIcon: {
    width: 24,
  },
  connectionInput: {
    display: 'flex',
    height: 50,
    width: '90%',
    paddingLeft: 12,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
});
