import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ClientsTabScreen} from '../screens/ClientsTabScreen';
import {PlanTabScreen} from '../screens/PlanTabScreen';
import {ClientsProfileScreen} from '../screens/ClientsProfileScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {TabNavigator} from './TabNavigator';

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabBar" component={TabNavigator} />
      <Stack.Screen name="Home" component={ClientsTabScreen} />
      <Stack.Screen name="Plan" component={PlanTabScreen} />
      <Stack.Screen name="Profile" component={ClientsProfileScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});
