import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export const ConnectionMethod = ({icon, title, handleConnectionMethod}) => {
  return (
    <TouchableOpacity
      style={styles.typeOfConnection}
      onPress={() => handleConnectionMethod(title, icon)}>
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
