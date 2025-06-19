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
import {PlusMenuModal} from './PlusMenuModal';

const Tab = createBottomTabNavigator();

// Пустий компонент, який нічого не рендерить
const EmptyScreen = () => null;

export const TabNavigator = ({navigation}) => {
  const changeColor = focused => (focused ? '#FFFF65' : '#FFFFFF');

  const renderTabIcon =
    (tabName, SvgComponent) =>
    ({focused}) =>
      (
        <TabItemContainer tabName={tabName} color={changeColor(focused)}>
          <SvgComponent color={changeColor(focused)} />
        </TabItemContainer>
      );

  const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
      position: 'relative',
      height: 65,
      backgroundColor: 'black',
      elevation: 0,
    },
  };

  return (
    <>
      <PlusMenuModal navigation={navigation} />
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Plan"
          component={PlanTabScreen}
          options={{
            tabBarIcon: renderTabIcon('План', SvgPlan),
          }}
        />
        <Tab.Screen
          name="Clients"
          component={ClientsTabScreen}
          options={{
            tabBarIcon: renderTabIcon('Клієнти', SvgClients),
          }}
        />
        <Tab.Screen
          name="btn"
          component={EmptyScreen}
          listeners={{
            tabPress: e => e.preventDefault(), // Заборонити перемикання
          }}
          options={{
            tabBarIcon: () => <TabPlusButton />,
          }}
        />
        <Tab.Screen
          name="Templates"
          component={TemplatesTabScreen}
          options={{
            tabBarIcon: renderTabIcon('Програми', SvgTemplates),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileTabScreen}
          options={{
            tabBarIcon: renderTabIcon('Профіль', SvgProfile),
          }}
        />
      </Tab.Navigator>
    </>
  );
};
