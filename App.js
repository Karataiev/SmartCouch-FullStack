import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ToastProvider} from './src/castomHooks/useToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigator} from './src/components/StackNavigator';
import {StatusBar} from 'react-native';

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setInitialRoute(seen ? 'TabBar' : 'Onboarding');
    };
    checkOnboarding();
  }, []);

  if (!initialRoute) return null;

  return (
    <ToastProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <NavigationContainer>
        <StackNavigator initialRouteName={initialRoute} />
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;
