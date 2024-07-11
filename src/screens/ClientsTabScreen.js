import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export const ClientsTabScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Plan');
  };
  return (
    <View>
      <Text>ClientsTabScreen</Text>

      <TouchableOpacity onPress={() => handlePress()}>
        <Text>Move to Plan screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});
