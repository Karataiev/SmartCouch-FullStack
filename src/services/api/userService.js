import {apiClient} from './apiClient';

/**
 * Сервіс для роботи з профілем користувача
 */
export const userService = {
  /**
   * Отримати профіль поточного користувача
   */
  async getProfile() {
    return apiClient.get('/api/v1/user/profile');
  },

  /**
   * Оновити профіль поточного користувача
   */
  async updateProfile(profileData) {
    return apiClient.put('/api/v1/user/profile', profileData);
  },

  /**
   * Видалити акаунт поточного користувача
   */
  async deleteAccount() {
    return apiClient.delete('/api/v1/user/account');
  },
};
