import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgBackBtn} from '../assets/svgIcons/SvgBackBtn';
import {SvgConfigBtn} from '../assets/svgIcons/SvgConfigBtn';
import {useDispatch, useSelector} from 'react-redux';
import {removeLastClient} from '../redux/action';

export const HeaderWithBackButton = ({
  children,
  navigation,
  configBtn,
  editClientInfo,
}) => {
  const dispatch = useDispatch();
  const clientsArr = useSelector(state => state.clients);

  const handleBackBtn = () => {
    if (editClientInfo === true) {
      const newClientsArr = clientsArr.slice(0, -1);
      dispatch(removeLastClient(newClientsArr));
    }

    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.button} onPress={() => handleBackBtn()}>
        <SvgBackBtn />
      </TouchableOpacity>

      {children && <Text style={styles.title}>{children}</Text>}

      {configBtn === true && (
        <TouchableOpacity style={styles.button}>
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
