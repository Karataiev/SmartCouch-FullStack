import {apiClient} from './apiClient';

/**
 * Сервіс для аутентифікації
 */
export const authService = {
  /**
   * Реєстрація (відправка номера телефону)
   */
  async register(phone) {
    return apiClient.post('/api/v1/auth/register', {phone});
  },

  /**
   * Верифікація SMS коду
   */
  async verifyCode(phone, code) {
    return apiClient.post('/api/v1/auth/verify-code', {phone, code});
  },

  /**
   * Створення паролю (після верифікації)
   */
  async createPassword(phone, password) {
    const response = await apiClient.post('/api/v1/auth/create-password', {
      phone,
      password,
    });

    // Зберігаємо токени
    if (response.tokens) {
      await apiClient.setTokens(
        response.tokens.access,
        response.tokens.refresh,
      );
    }

    return response;
  },

  /**
   * Вхід в систему
   */
  async login(phone, password) {
    const response = await apiClient.post('/api/v1/auth/login', {
      phone,
      password,
    });

    // Зберігаємо токени
    if (response.tokens) {
      await apiClient.setTokens(
        response.tokens.access,
        response.tokens.refresh,
      );
    }

    return response;
  },

  /**
   * Оновлення access токену
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/api/v1/auth/refresh-token', {
      refreshToken,
    });

    // Зберігаємо нові токени
    if (response.tokens) {
      await apiClient.setTokens(
        response.tokens.access,
        response.tokens.refresh,
      );
    }

    return response;
  },

  /**
   * Вихід з системи
   */
  async logout(refreshToken) {
    try {
      await apiClient.post('/api/v1/auth/logout', {refreshToken});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Очищаємо токени навіть якщо запит не вдався
      await apiClient.clearTokens();
    }
  },

  /**
   * Відновлення паролю (відправка номера телефону)
   */
  async forgotPassword(phone) {
    return apiClient.post('/api/v1/auth/forgot-password', {phone});
  },
};
