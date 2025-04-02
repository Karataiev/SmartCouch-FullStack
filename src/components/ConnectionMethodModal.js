import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgInstagram} from '../assets/svgIcons/SvgInstagram';
import {SvgTelegram} from '../assets/svgIcons/SvgTelegram';
import {SvgViber} from '../assets/svgIcons/SvgViber';
import {SvgWhatsapp} from '../assets/svgIcons/SvgWhatsapp';
import {ConnectionMethod} from './ConnectionMethod';

export const ConnectionMethodModal = ({
  visible,
  hideModal,
  handleConnectionMethod,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        hideModal(!visible);
      }}
      animationType="slide">
      <TouchableOpacity
        style={styles.outsideOfModal}
        onPress={() => hideModal()}
        activeOpacity={1}
      />
      <View style={styles.connectionModal}>
        <Text style={styles.connectionModalTitle}>Оберіть спосіб звʼязку</Text>
        <View style={styles.connectionMethodContainer}>
          <ConnectionMethod
            icon={<SvgInstagram />}
            title="Instagram"
            handleConnectionMethod={handleConnectionMethod}
          />
          <ConnectionMethod
            icon={<SvgTelegram />}
            title="Telegram"
            handleConnectionMethod={handleConnectionMethod}
          />
          <ConnectionMethod
            icon={<SvgViber />}
            title="Viber"
            handleConnectionMethod={handleConnectionMethod}
          />
          <ConnectionMethod
            icon={<SvgWhatsapp />}
            title="WhatsApp"
            handleConnectionMethod={handleConnectionMethod}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  connectionModal: {
    display: 'flex',
    width: '100%',
    marginTop: 'auto',
    paddingTop: 38,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#292929',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  connectionModalTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: 'white',
  },
  connectionMethodContainer: {
    width: '100%',
    paddingTop: 39,
    gap: 8,
  },
  outsideOfModal: {
    flex: 1,
  },
});
