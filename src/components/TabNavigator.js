import {StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlanTabScreen} from '../screens/PlanTabScreen';
import {ClientsTabScreen} from '../screens/ClientsTabScreen';
import {TemplatesTabScreen} from '../screens/TemplatesTabScreen';
import {ProfileTabScreen} from '../screens/ProfileTabScreen';
import {SvgPlan} from '../assets/tabIcons/SvgPlan';
import {SvgClients} from '../assets/tabIcons/SvgClients';
import {SvgTemplates} from '../assets/tabIcons/SvgTemplates';
import {SvgProfile} from '../assets/tabIcons/SvgProfile';
import {TabItemContainer} from './TabItemContainer';
import {TabPlusButton} from './TabPlusButton';

export const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const changeColor = focused => (focused ? '#FFFF65' : '#FFFFFF');

  const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
      position: 'relative',
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: 65,
      backgroundColor: 'black',
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Plan"
        component={PlanTabScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TabItemContainer tabName="План" color={changeColor(focused)}>
                <SvgPlan color={changeColor(focused)} />
              </TabItemContainer>
            );
          },
        }}
      />
      <Tab.Screen
        name="Clients"
        component={ClientsTabScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TabItemContainer tabName="Клієнти" color={changeColor(focused)}>
                <SvgClients color={changeColor(focused)} />
              </TabItemContainer>
            );
          },
        }}
      />
      <Tab.Screen
        name="btn"
        component={''}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          },
        }}
        options={{
          tabBarIcon: ({}) => {
            return <TabPlusButton />;
          },
        }}
      />
      <Tab.Screen
        name="Templates"
        component={TemplatesTabScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TabItemContainer tabName="Шаблони" color={changeColor(focused)}>
                <SvgTemplates color={changeColor(focused)} />
              </TabItemContainer>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTabScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TabItemContainer tabName="Профіль" color={changeColor(focused)}>
                <SvgProfile color={changeColor(focused)} />
              </TabItemContainer>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});
