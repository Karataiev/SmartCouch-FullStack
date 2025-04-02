import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgBackBtn} from '../assets/svgIcons/SvgBackBtn';
import {SvgConfigBtn} from '../assets/svgIcons/SvgConfigBtn';
import {SvgEditBtn} from '../assets/svgIcons/SvgEditBtn';
import {SvgAddBtn} from '../assets/svgIcons/SvgAddBtn';

export const HeaderWithBackButton = ({
  children,
  navigation,
  configBtn,
  editBtn,
  addBtn,
  goHome,
  onPressConfig,
  onPressEdit,
  onPressAdd,
}) => {
  const handleBackBtn = () => {
    if (goHome === true) {
      navigation.navigate('Clients');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.button} onPress={() => handleBackBtn()}>
        <SvgBackBtn />
      </TouchableOpacity>

      {children && <Text style={styles.title}>{children}</Text>}

      {configBtn && (
        <TouchableOpacity style={styles.button} onPress={onPressConfig}>
          <SvgConfigBtn />
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
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    padding: 12,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 200,
    overflow: 'hidden',
    zIndex: 1,
  },
  addBtn: {
    backgroundColor: 'white',
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    color: 'white',
  },
});
