import {API_BASE_URL} from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Базовий API клієнт з підтримкою:
 * - Автоматичного додавання токенів
 * - Refresh token при 401 помилці
 * - Обробки помилок
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Отримує access token з AsyncStorage
   */
  async getAccessToken() {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Отримує refresh token з AsyncStorage
   */
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Зберігає токени в AsyncStorage
   */
  async setTokens(accessToken, refreshToken) {
    try {
      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  /**
   * Видаляє токени з AsyncStorage
   */
  async clearTokens() {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Оновлює access token через refresh token
   */
  async refreshAccessToken() {
    if (this.isRefreshing) {
      // Якщо вже оновлюємо токен, чекаємо
      return new Promise((resolve, reject) => {
        this.failedQueue.push({resolve, reject});
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(
        `${this.baseURL}/api/v1/auth/refresh-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({refreshToken}),
        },
      );

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = JSON.parse(text);
      } else {
        const text = await response.text();
        throw new Error(`Invalid response: ${text}`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to refresh token');
      }

      // Зберігаємо нові токени
      if (data.tokens) {
        await this.setTokens(data.tokens.access, data.tokens.refresh);
      }

      // Виконуємо всі запити з черги
      this.failedQueue.forEach(({resolve}) => resolve());
      this.failedQueue = [];

      return data.tokens.access;
    } catch (error) {
      // Якщо refresh не вдався, очищаємо токени та відхиляємо всі запити
      await this.clearTokens();
      this.failedQueue.forEach(({reject}) => reject(error));
      this.failedQueue = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Виконує HTTP запит з автоматичним додаванням токенів та обробкою помилок
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = await this.getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Додаємо токен, якщо він є (крім auth endpoints)
    if (accessToken && !endpoint.includes('/auth/')) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      let response = await fetch(url, config);

      // Обробка 401 помилки - спроба оновити токен
      if (response.status === 401 && !endpoint.includes('/auth/')) {
        try {
          const newAccessToken = await this.refreshAccessToken();
          // Повторюємо запит з новим токеном
          headers.Authorization = `Bearer ${newAccessToken}`;
          response = await fetch(url, {...config, headers});
        } catch (refreshError) {
          // Якщо refresh не вдався, повертаємо помилку
          throw new Error('Session expired. Please login again.');
        }
      }

      // Парсимо відповідь
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON response from server');
          }
        } else {
          data = {};
        }
      } else {
        const text = await response.text();
        data = {message: text || 'Unknown error'};
      }

      // Якщо помилка, викидаємо її
      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Обробка різних типів мережевих помилок
      const errorMessage = error.message || '';
      
      // Перевірка на відсутність інтернет-з'єднання
      if (
        errorMessage === 'Network request failed' ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('ERR_NETWORK') ||
        errorMessage.includes('ERR_INTERNET_DISCONNECTED')
      ) {
        throw new Error(
          'Відсутнє підключення до інтернету. Перевірте налаштування мережі та спробуйте ще раз.',
        );
      }
      
      // Перевірка на timeout
      if (
        errorMessage.includes('timeout') ||
        errorMessage.includes('TIMEOUT') ||
        errorMessage.includes('Request timeout')
      ) {
        throw new Error(
          'Час очікування відповіді вичерпано. Перевірте підключення до інтернету та спробуйте ще раз.',
        );
      }
      
      // Якщо помилка вже має зрозуміле повідомлення, залишаємо його
      if (error.message && error.message !== 'Network request failed') {
        throw error;
      }
      
      // Для інших невідомих помилок
      throw new Error(
        error.message ||
          'Помилка підключення до сервера. Перевірте інтернет-з\'єднання та спробуйте ще раз.',
      );
    }
  }

  /**
   * GET запит
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST запит
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT запит
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE запит
   */
  async delete(endpoint, data, options = {}) {
    const config = {
      ...options,
      method: 'DELETE',
    };

    // Якщо передано дані, додаємо їх в body
    if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request(endpoint, config);
  }
}

// Експортуємо singleton
export const apiClient = new ApiClient();
