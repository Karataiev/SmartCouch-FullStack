import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SvgArrowRight} from '../assets/svgIcons/SvgArrowRight';

export const TemplateItem = ({children, handlePress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => handlePress()}>
      <Text style={styles.title}>{children}</Text>
      <SvgArrowRight />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
});
