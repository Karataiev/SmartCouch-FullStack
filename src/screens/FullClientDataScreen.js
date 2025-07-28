import {StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {ClientDataComponent} from '../components/ClientDataComponent';
import {ClientEditDataComponent} from '../components/ClientEditDataComponent';
import {LayoutComponent} from '../components/LayoutComponent';

export const FullClientDataScreen = ({navigation, route}) => {
  const {itemData, from} = route.params;
  const [isToggleEdit, setIsToggleEdit] = useState(false);

  const handleEdit = () => {
    setIsToggleEdit(true);
  };

  useEffect(() => {
    if (from === 'modal') {
      setIsToggleEdit(true);
    } else {
      setIsToggleEdit(false);
    }
  }, []);

  return (
    <LayoutComponent>
      <View style={styles.container}>
        <StatusBar backgroundColor="#121313" />
        <HeaderWithBackButton
          navigation={navigation}
          editBtn={!isToggleEdit}
          onPressEdit={handleEdit}>
          {isToggleEdit ? 'Редагування' : 'Дані клієнта'}
        </HeaderWithBackButton>

        {isToggleEdit ? (
          <ClientEditDataComponent
            itemData={itemData}
            navigation={navigation}
          />
        ) : (
          <ClientDataComponent itemData={itemData} />
        )}
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
