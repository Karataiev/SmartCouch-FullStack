import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export const PlusMenuItem = ({title, icon, onPress}) => {
  return (
    <TouchableOpacity
      key={title}
      style={styles.menuItem}
      onPress={() => onPress()}>
      {icon}
      <Text style={styles.menuItemTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#292929',
    paddingVertical: 22,
    width: '47%',
    gap: 12,
  },
  menuItemTitle: {
    color: 'white',
    fontSize: 11,
    lineHeight: 13,
  },
});
