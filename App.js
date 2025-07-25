/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './src/components/StackNavigator';
import {ToastProvider} from './src/castomHooks/useToast';

function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;
