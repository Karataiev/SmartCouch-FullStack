import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {SvgRemoveItem} from '../assets/svgIcons/SvgRemoveItem';
import {removeConnectionMethod} from '../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';

export const ChooseConnectionMethod = ({el}) => {
  const [connectionMethodsLink, setConnectionMethodsLink] = useState('');
  const connectionMethods = useSelector(state => state.connectionMethods);
  const dispatch = useDispatch();

  const handleRemoveBtn = el => {
    const newConnectionArr = connectionMethods.filter(elem => elem.type !== el);
    dispatch(removeConnectionMethod(newConnectionArr));
  };
  return (
    <View style={styles.connectionInputBlock}>
      <View style={styles.connectionIcon}>{el.icon}</View>
      <TextInput
        value={connectionMethodsLink}
        onChangeText={setConnectionMethodsLink}
        style={styles.connectionInput}
        placeholder="Посилання на профіль"
        placeholderTextColor={'#A1A1A1'}
      />
      <TouchableOpacity onPress={() => handleRemoveBtn(el.type)}>
        <SvgRemoveItem />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  connectionInputBlock: {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  connectionIcon: {
    width: 24,
  },
  connectionInput: {
    display: 'flex',
    height: 50,
    width: '90%',
    paddingLeft: 12,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
});
