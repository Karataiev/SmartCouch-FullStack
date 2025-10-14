import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {ClientDataComponent} from '../components/ClientDataComponent';
import {ClientEditDataComponent} from '../components/ClientEditDataComponent';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

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
  }, [from]);

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
