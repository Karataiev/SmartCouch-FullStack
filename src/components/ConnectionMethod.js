import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addConnectionMethod} from '../redux/action';

export const ConnectionMethod = ({addingStyle, icon, title, hideModal}) => {
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
      style={[styles.typeOfConnection, addingStyle && styles.topDistance]}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
  },
  topDistance: {
    marginTop: 30,
  },
});
