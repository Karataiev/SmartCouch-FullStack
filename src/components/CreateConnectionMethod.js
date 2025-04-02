import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SvgConnectionMethod} from '../assets/svgIcons/SvgConnectionMethod';

export const CreateConnectionMethod = ({toggleModal}) => {
  return (
    <TouchableOpacity style={styles.addMethodBtn} onPress={() => toggleModal()}>
      <SvgConnectionMethod />
      <Text style={styles.btnTitle}>Додати спосіб звʼязку</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addMethodBtn: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    gap: 4,
  },
  btnTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: 'white',
  },
});
