import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setPlusMenuBtn} from '../redux/action';
import {SvgClose} from '../assets/svgIcons/SvgClose';
import {SvgCreateProgram} from '../assets/svgIcons/SvgCreateProgram';
import {SvgCreateService} from '../assets/svgIcons/SvgCreateService';
import {PlusMenuItem} from './PlusMenuItem';
import {SvgClients} from '../assets/tabIcons/SvgClients';

export const PlusMenuModal = ({navigation}) => {
  const isBtnClick = useSelector(state => state.app.isPlusMenuBtn);
  const dispatch = useDispatch();

  const handleCreate = way => {
    dispatch(setPlusMenuBtn(!isBtnClick));
    navigation.navigate(way, {
      data: {},
    });
  };

  const handleClose = () => {
    dispatch(setPlusMenuBtn(!isBtnClick));
  };

  return (
    <Modal
      transparent={true}
      visible={isBtnClick}
      onRequestClose={() => {
        handleClose();
      }}
      animationType="slide">
      <TouchableOpacity
        style={styles.outsideOfModal}
        onPress={() => handleClose()}
        activeOpacity={1}
      />

      <View style={styles.containerMenuModal}>
        <Text style={styles.menuModalHeader}>Створити</Text>
        <View style={styles.menuItemsContainer}>
          <PlusMenuItem
            title={'Запис тренування'}
            icon={<SvgCreateService />}
            onPress={() => handleCreate('TrainingPlanning')}
          />
          <PlusMenuItem
            title={'Клієнта'}
            icon={<SvgClients color={'white'} />}
            onPress={() => handleCreate('CreateClient')}
          />
          <PlusMenuItem
            title={'Програму'}
            icon={<SvgCreateProgram />}
            onPress={() => handleCreate('CreateProgram')}
          />
          {/* <PlusMenuItem
            title={'Послугу'}
            icon={<SvgCreateService />}
            onPress={() => handleCreate()}
          /> */}
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => handleClose()}>
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
  menuModalHeader: {
    color: 'white',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
  },
  menuItemsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    width: '100%',
    gap: 15,
  },
  closeButton: {
    backgroundColor: 'white',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 50,
    marginTop: 'auto',
  },
});
