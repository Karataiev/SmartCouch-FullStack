import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {ClientDataComponent} from '../components/ClientDataComponent';
import {ClientEditDataComponent} from '../components/ClientEditDataComponent';

export const FullClientDataScreen = ({navigation, route}) => {
  const {itemData} = route.params;
  const [isToggleEdit, setIsToggleEdit] = useState(false);

  const handleEdit = () => {
    setIsToggleEdit(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#232323'} />
      <HeaderWithBackButton
        navigation={navigation}
        editBtn={!isToggleEdit}
        onPressEdit={handleEdit}>
        {isToggleEdit ? 'Редагування' : 'Дані клієнта'}
      </HeaderWithBackButton>

      {isToggleEdit ? (
        <ClientEditDataComponent itemData={itemData} />
      ) : (
        <ClientDataComponent itemData={itemData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
