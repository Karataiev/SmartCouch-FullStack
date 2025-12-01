import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {SvgRemoveItem} from '../assets/svgIcons/SvgRemoveItem';
import {SvgInstagram} from '../assets/svgIcons/SvgInstagram';
import {SvgTelegram} from '../assets/svgIcons/SvgTelegram';
import {SvgViber} from '../assets/svgIcons/SvgViber';
import {SvgWhatsapp} from '../assets/svgIcons/SvgWhatsapp';
import {useEffect, useState} from 'react';

const renderIcon = type => {
  switch (type) {
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

export const ClientEditConnectionMethod = ({
  el,
  handleRemoveBtn,
  setIsActiveSubmitBtn,
  getConnectionMethodLink,
}) => {
  const [value, setValue] = useState(el.link);

  useEffect(() => {
    if (el.link !== value) {
      setIsActiveSubmitBtn(true);
      getConnectionMethodLink(el.type, value);
    } else {
      setIsActiveSubmitBtn(false);
    }
  }, [value]);

  return (
    <View style={styles.connectionInputBlock} key={el.type}>
      <View style={styles.connectionIcon}>{renderIcon(el.type)}</View>
      <TextInput
        value={value}
        onChangeText={setValue}
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
    marginBottom: 20,
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
