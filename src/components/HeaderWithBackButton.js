import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgBackBtn} from '../assets/svgIcons/SvgBackBtn';

export const HeaderWithBackButton = ({children, navigation}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <SvgBackBtn />
      </TouchableOpacity>

      <Text style={styles.title}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 4,
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    padding: 12,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 200,
    zIndex: 1,
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
