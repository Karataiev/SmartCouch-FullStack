import {createStackNavigator} from '@react-navigation/stack';
import {TabNavigator} from './TabNavigator';
import {CreateClientScreen} from '../screens/CreateClientScreen';
import {ClientsProfileScreen} from '../screens/ClientsProfileScreen';
import {MyDataScreen} from '../screens/MyDataScreen';
import {FullClientDataScreen} from '../screens/FullClientDataScreen';
import {ClientProgramsScreen} from '../screens/ClientProgramsScreen';
import {CreateProgramScreen} from '../screens/CreateProgramScreen';
import {CurrentProgramScreen} from '../screens/CurrentProgramScreen';

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabBar" component={TabNavigator} />
      <Stack.Screen name="MyData" component={MyDataScreen} />
      <Stack.Screen name="FullClientData" component={FullClientDataScreen} />
      <Stack.Screen name="ClientPrograms" component={ClientProgramsScreen} />
      <Stack.Screen name="CreateClientScreen" component={CreateClientScreen} />
      <Stack.Screen name="CreateProgram" component={CreateProgramScreen} />
      <Stack.Screen name="CurrentProgram" component={CurrentProgramScreen} />
      <Stack.Screen
        name="ClientsProfileScreen"
        component={ClientsProfileScreen}
      />
    </Stack.Navigator>
  );
};
