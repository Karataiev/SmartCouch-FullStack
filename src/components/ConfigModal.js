import React from 'react';
import {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const ConfigModal = ({
  visible,
  hideModal,
  handleNavigate,
  handleRemove,
  whereIsOpen,
}) => {
  const [isActiveRemoveBtn, setIsActiveRemoveBtn] = useState(false);

  const handleFirstButton = () => {
    if (whereIsOpen === 'CurrentProgram') {
      handleNavigate('ClientProgramAssignment');
    } else {
      handleNavigate('FullClientData', 'modal');
    }
    hideModal();
  };

  const handleConfirmRemoveButton = () => {
    handleRemove();
    setIsActiveRemoveBtn(false);
    hideModal();

    if (whereIsOpen === 'CurrentProgram') {
      handleNavigate('MyPrograms');
    } else {
      handleNavigate('Clients');
    }
  };

  const handleCancelBtn = () => {
    setIsActiveRemoveBtn(false);
    hideModal();
  };

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
        {isActiveRemoveBtn ? (
          <View style={styles.modalConfigsBlock}>
            <Text style={styles.removeQuestion}>Видалити?</Text>
            <View style={styles.removeBtnsBlock}>
              <TouchableOpacity
                style={styles.removeBlockBtn}
                onPress={() => handleConfirmRemoveButton()}>
                <Text style={styles.modalConfigsText}>Так</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBlockBtn}
                onPress={() => setIsActiveRemoveBtn(false)}>
                <Text style={[styles.modalConfigsText, styles.redBtn]}>Ні</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.modalConfigsBlock}>
            <TouchableOpacity
              style={[styles.configBtn, styles.borderLine]}
              onPress={() => handleFirstButton()}>
              <Text style={styles.modalConfigsText}>
                {whereIsOpen !== 'CurrentProgram'
                  ? 'Редагувати'
                  : 'Закріпити за клієнтом'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.configBtn}
              onPress={() => setIsActiveRemoveBtn(true)}>
              <Text style={[styles.modalConfigsText, {color: 'red'}]}>
                Видалити
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.closeModalBtn}
          onPress={() => handleCancelBtn()}>
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
    paddingBottom: 20,
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

  removeQuestion: {
    paddingVertical: 17,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'white',
  },
  removeBtnsBlock: {
    display: 'flex',
    flexDirection: 'row',
  },
  removeBlockBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    width: '50%',
  },
  redBtn: {
    color: 'red',
  },
});
