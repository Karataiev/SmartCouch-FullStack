import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addConnectionMethod} from '../redux/action';

export const ConnectionMethod = ({icon, title, hideModal}) => {
  const dispatch = useDispatch();
  const connectionMethods = useSelector(state => state.connectionMethods);

  const createConnectionMethod = () => {
    const containElement = connectionMethods.find(el => el.type === title);

    if (connectionMethods.length === 0 || !containElement) {
      dispatch(
        addConnectionMethod({
          type: title,
          icon: icon,
        }),
      );
    }
    hideModal();
  };

  return (
    <TouchableOpacity
      style={styles.typeOfConnection}
      onPress={() => createConnectionMethod()}>
      {icon}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  typeOfConnection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    backgroundColor: '#3D3D3D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
  },
});
