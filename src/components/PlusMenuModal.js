import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {isPlusMenuBtn} from '../redux/action';
import {SvgClose} from '../assets/svgIcons/SvgClose';

export const PlusMenuModal = () => {
  const isBtnClick = useSelector(state => state.isPlusMenuBtn);
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(isPlusMenuBtn(!isBtnClick));
  };

  return (
    <Modal
      transparent={true}
      visible={isBtnClick}
      onRequestClose={() => {
        hideModal();
      }}
      animationType="slide">
      <TouchableOpacity
        style={styles.outsideOfModal}
        onPress={() => hideModal()}
        activeOpacity={1}
      />

      <View style={styles.containerMenuModal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => hideModal()}>
          <SvgClose />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outsideOfModal: {
    flex: 1,
  },
  containerMenuModal: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    paddingTop: 38,
    paddingBottom: 10,
    paddingHorizontal: 20,

    backgroundColor: 'black',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  closeButton: {
    backgroundColor: 'white',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 50,
  },
});
