import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export const RemoveModal = ({
  visible,
  handleRemove,
  hideModal,
  headerTitle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hideModal}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={hideModal}
        activeOpacity={1}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          onPress={() => {}}>
          <Text style={styles.title}>{headerTitle}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleRemove}>
              <Text style={styles.buttonText}>Так</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={hideModal}>
              <Text style={styles.buttonText}>Ні</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: '#232929',
    borderRadius: 14,
    padding: 20,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'white',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#3EB1CC',
  },
  cancelButton: {
    backgroundColor: '#364040',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
