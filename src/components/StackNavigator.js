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
import {ReadyMadeProgramsScreen} from '../screens/ReadyMadeProgramsScreen';
import {ExercisesScreen} from '../screens/ExercisesScreen';
import {TemplatesChooseProgramScreen} from '../screens/TemplatesChooseProgramScreen';
import {ClientProgramAssignmentScreen} from '../screens/ClientProgramAssignment';
import {ProgramClientAssignmentScreen} from '../screens/ProgramClientAssignmentScreen';
import {ClientParametersScreen} from '../screens/ClientParametersScreen';
import {TrainingPlanningScreen} from '../screens/TrainingPlanningScreen';

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
      <Stack.Screen
        name="ClientProgramAssignment"
        component={ClientProgramAssignmentScreen}
      />
      <Stack.Screen name="ClientsProfile" component={ClientsProfileScreen} />
      <Stack.Screen
        name="ReadyMadePrograms"
        component={ReadyMadeProgramsScreen}
      />
      <Stack.Screen name="Exercises" component={ExercisesScreen} />
      <Stack.Screen
        name="TemplatesChooseProgram"
        component={TemplatesChooseProgramScreen}
      />
      <Stack.Screen
        name="ProgramClientAssignment"
        component={ProgramClientAssignmentScreen}
      />
      <Stack.Screen
        name="ClientParameters"
        component={ClientParametersScreen}
      />
      <Stack.Screen
        name="TrainingPlanning"
        component={TrainingPlanningScreen}
      />
    </Stack.Navigator>
  );
};
