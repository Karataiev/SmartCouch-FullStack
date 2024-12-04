import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgBackBtn} from '../assets/svgIcons/SvgBackBtn';
import {SvgConfigBtn} from '../assets/svgIcons/SvgConfigBtn';

export const HeaderWithBackButton = ({
  children,
  navigation,
  configBtn,
  goHome,
  onPress,
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

      {configBtn === true && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <SvgConfigBtn />
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
