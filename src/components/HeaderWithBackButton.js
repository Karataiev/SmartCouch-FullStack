import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgBackBtn} from '../assets/svgIcons/SvgBackBtn';
import {SvgConfigBtn} from '../assets/svgIcons/SvgConfigBtn';
import {SvgEditBtn} from '../assets/svgIcons/SvgEditBtn';
import {SvgAddBtn} from '../assets/svgIcons/SvgAddBtn';
import {SvgFastenBtn} from '../assets/svgIcons/SvgFastenBtn';
import {SvgRemoveBtn} from '../assets/svgIcons/SvgRemoveBtn';
import {useNavigation} from '@react-navigation/native';

export const HeaderWithBackButton = ({
  children,
  configBtn = false,
  editBtn = false,
  addBtn = false,
  fastenForBtn = false,
  goHome = false,
  goPrograms = false,
  goTo,
  onPressConfig,
  onPressEdit,
  onPressAdd,
  onPressFasten,
  onPressRemove,
  origin,
}) => {
  const navigation = useNavigation();

  const handleBackBtn = () => {
    if (goTo) {
      navigation.navigate(goTo);
    } else if (goHome) {
      navigation.navigate('Clients');
    } else if (goPrograms) {
      navigation.navigate('Templates');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.button} onPress={handleBackBtn}>
        <SvgBackBtn />
      </TouchableOpacity>

      {children ? <Text style={styles.title}>{children}</Text> : null}

      <View style={styles.btnsBlock}>
        {fastenForBtn && (
          <TouchableOpacity style={styles.button} onPress={onPressFasten}>
            <SvgFastenBtn />
          </TouchableOpacity>
        )}

        {configBtn && !origin && (
          <TouchableOpacity style={styles.button} onPress={onPressConfig}>
            <SvgConfigBtn />
          </TouchableOpacity>
        )}

        {origin && (
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={onPressRemove}>
            <SvgRemoveBtn />
          </TouchableOpacity>
        )}

        {editBtn && (
          <TouchableOpacity style={styles.button} onPress={onPressEdit}>
            <SvgEditBtn />
          </TouchableOpacity>
        )}

        {addBtn && (
          <TouchableOpacity
            style={[styles.button, styles.addBtn]}
            onPress={onPressAdd}>
            <SvgAddBtn />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    padding: 12,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 100,
    overflow: 'hidden',
  },
  addBtn: {
    backgroundColor: 'white',
  },
  removeButton: {
    paddingHorizontal: 14,
  },
  btnsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  title: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21,
    color: 'white',
    zIndex: -1,
  },
});
