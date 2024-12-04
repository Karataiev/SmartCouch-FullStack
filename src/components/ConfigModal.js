import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const ConfigModal = ({visible, hideModal}) => {
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
        activeOpacity={5}
      />

      <View style={styles.modalContent}>
        <View style={styles.modalConfigsBlock}>
          <TouchableOpacity style={[styles.configBtn, styles.borderLine]}>
            <Text style={styles.modalConfigsText}>Редагувати клієнта</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.configBtn}>
            <Text style={[styles.modalConfigsText, {color: 'red'}]}>
              Видалити
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeModalBtn}>
          <Text style={styles.modalConfigsText}>Відміна</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outsideOfModal: {
    flex: 1,
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 8,
  },
  modalConfigsBlock: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#2E2E2E',
  },
  configBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
  },
  borderLine: {
    borderBottomColor: '#FFFFFF66',
    borderBottomWidth: 0.5,
  },
  modalConfigsText: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'white',
  },
  closeModalBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    width: '100%',
    backgroundColor: '#3D3D3D',
    borderRadius: 14,
  },
});
