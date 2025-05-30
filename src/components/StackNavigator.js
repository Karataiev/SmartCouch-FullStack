import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {TabNavigator} from './TabNavigator';
import {CreateClientScreen} from '../screens/CreateClientScreen';
import {ClientsProfileScreen} from '../screens/ClientsProfileScreen';
import {MyDataScreen} from '../screens/MyDataScreen';
import {FullClientDataScreen} from '../screens/FullClientDataScreen';
import {MyProgramsScreen} from '../screens/MyProgramsScreen';
import {CreateProgramScreen} from '../screens/CreateProgramScreen';
import {CurrentProgramScreen} from '../screens/CurrentProgramScreen';
import {PinningProgramScreen} from '../screens/PinningProgramScreen';
import {ReadyMadeProgramsScreen} from '../screens/ReadyMadeProgramsScreen';
import {ExercisesScreen} from '../screens/ExercisesScreen';

export const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabBar" component={TabNavigator} />
      <Stack.Screen name="MyData" component={MyDataScreen} />
      <Stack.Screen name="FullClientData" component={FullClientDataScreen} />
      <Stack.Screen name="MyPrograms" component={MyProgramsScreen} />
      <Stack.Screen name="CreateClient" component={CreateClientScreen} />
      <Stack.Screen name="CreateProgram" component={CreateProgramScreen} />
      <Stack.Screen name="CurrentProgram" component={CurrentProgramScreen} />
      <Stack.Screen name="PinningProgram" component={PinningProgramScreen} />
      <Stack.Screen name="ClientsProfile" component={ClientsProfileScreen} />
      <Stack.Screen
        name="ReadyMadePrograms"
        component={ReadyMadeProgramsScreen}
      />
      <Stack.Screen name="Exercises" component={ExercisesScreen} />
    </Stack.Navigator>
  );
};
