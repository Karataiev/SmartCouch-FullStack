import {ClientsTabScreen} from '../screens/ClientsTabScreen';
import {PlanTabScreen} from '../screens/PlanTabScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {TabNavigator} from './TabNavigator';
import {ProfileTabScreen} from '../screens/ProfileTabScreen';
import {CreateClientScreen} from '../screens/CreateClientScreen';

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabBar" component={TabNavigator} />
      <Stack.Screen name="Home" component={ClientsTabScreen} />
      <Stack.Screen name="Plan" component={PlanTabScreen} />
      <Stack.Screen name="Profile" component={ProfileTabScreen} />
      <Stack.Screen name="CreateClientScreen" component={CreateClientScreen} />
    </Stack.Navigator>
  );
};
