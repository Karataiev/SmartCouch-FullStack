import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileHeaderComponent} from '../components/ProfileHeaderComponent';
import {ProfileMenuComponent} from '../components/ProfileMenuComponent';
import {LayoutComponent} from '../components/LayoutComponent';
import {useDispatch} from 'react-redux';
import {logout, fetchUserProfile} from '../redux/thunks/authThunk';

export const ProfileTabScreen = ({navigation}) => {
  const dispatch = useDispatch();

  // Завантаження профілю користувача при фокусі на екрані
  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          if (accessToken) {
            await dispatch(fetchUserProfile()).unwrap();
          }
        } catch (error) {
          console.error('Помилка завантаження профілю:', error);
        }
      };
      loadProfile();
    }, [dispatch]),
  );

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Помилка при виході:', error);
      // Навіть якщо помилка, перенаправляємо на логін
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  return (
    <LayoutComponent>
      <View style={styles.profileContainer}>
        <ProfileHeaderComponent />
        <ProfileMenuComponent navigation={navigation} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Вихід</Text>
        </TouchableOpacity>
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#232929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: '#FF3B30',
  },
});
