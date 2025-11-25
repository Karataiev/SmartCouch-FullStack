import {createAsyncThunk} from '@reduxjs/toolkit';
import {authService, userService} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Логін користувача
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({phone, password}, {rejectWithValue}) => {
    try {
      if (!phone || !password) {
        throw new Error("Номер телефону та пароль обов'язкові");
      }

      const response = await authService.login(phone, password);

      // Зберігаємо дані користувача в AsyncStorage
      if (response.user && response.user.phone) {
        await AsyncStorage.setItem('userPhone', response.user.phone);
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка входу в систему');
    }
  },
);

/**
 * Логаут користувача
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      // Викликаємо API logout, якщо є refresh token
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (error) {
          // Якщо помилка, все одно очищаємо локальні дані
          console.error('Logout API error:', error);
        }
      }

      // Очищаємо всі дані з AsyncStorage
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userPhone',
      ]);

      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка виходу з системи');
    }
  },
);

/**
 * Завантаження профілю користувача
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await userService.getProfile();
      // Бекенд повертає { success: true, data: user }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка завантаження профілю');
    }
  },
);

/**
 * Оновлення профілю користувача
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, {rejectWithValue}) => {
    try {
      if (!profileData || typeof profileData !== 'object') {
        throw new Error('Невалідні дані профілю');
      }

      const response = await userService.updateProfile(profileData);
      // Бекенд повертає { success: true, message: '...', data: user }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка оновлення профілю');
    }
  },
);
