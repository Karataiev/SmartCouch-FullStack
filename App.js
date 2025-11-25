import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ToastProvider} from './src/castomHooks/useToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigator} from './src/components/StackNavigator';
import {StatusBar} from 'react-native';
import {userService} from './src/services/api';

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          setInitialRoute('Login');
          return;
        }

        // Перевіряємо валідність токену, спробувавши завантажити профіль
        try {
          await userService.getProfile();
          // Токен валідний
          setInitialRoute('TabBar');
        } catch (error) {
          // Токен невалідний або застарів - очищаємо та перенаправляємо на логін
          console.log('Token validation failed, redirecting to login');
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setInitialRoute('Login');
      }
    };
    checkAuth();
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
