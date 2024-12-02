import {createStackNavigator} from '@react-navigation/stack';
import {TabNavigator} from './TabNavigator';
import {CreateClientScreen} from '../screens/CreateClientScreen';
import {ClientsProfileScreen} from '../screens/ClientsProfileScreen';
import {MyDataScreen} from '../screens/MyDataScreen';

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabBar" component={TabNavigator} />
      <Stack.Screen name="MyData" component={MyDataScreen} />
      {/* <Stack.Screen name="Plan" component={PlanTabScreen} /> */}
      {/* <Stack.Screen name="Profile" component={ProfileTabScreen} /> */}
      <Stack.Screen name="CreateClientScreen" component={CreateClientScreen} />
      <Stack.Screen
        name="ClientsProfileScreen"
        component={ClientsProfileScreen}
      />
    </Stack.Navigator>
  );
};
