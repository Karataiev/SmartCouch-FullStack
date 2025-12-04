import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ToastProvider} from './src/castomHooks/useToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigator} from './src/components/StackNavigator';
import {StatusBar} from 'react-native';
import {userService} from './src/services/api';
import {useDispatch} from 'react-redux';
import {fetchUserProfile} from './src/redux/thunks/authThunk';
import {fetchClients} from './src/redux/thunks/clientsThunk';
import {fetchWorkoutPlans} from './src/redux/thunks/workoutPlansThunk';

function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const dispatch = useDispatch();

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
          // Токен валідний - встановлюємо маршрут та завантажуємо дані паралельно
          setInitialRoute('TabBar');
          // Завантажуємо дані паралельно для швидшої роботи
          Promise.all([
            dispatch(fetchUserProfile()),
            dispatch(fetchClients()),
            dispatch(fetchWorkoutPlans()),
          ]).catch(syncError => {
            console.error('Помилка синхронізації даних при старті:', syncError);
          });
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
  }, [dispatch]);

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
