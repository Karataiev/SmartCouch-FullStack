import {apiClient} from './apiClient';

/**
 * Сервіс для роботи з планами тренувань
 */
export const workoutPlansService = {
  /**
   * Отримати список планів тренувань
   * @param {Object} params - Query параметри (page, limit, date, clientId)
   */
  async getWorkoutPlans(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/v1/workout-plans?${queryString}`
      : '/api/v1/workout-plans';
    return apiClient.get(endpoint);
  },

  /**
   * Отримати план тренування по ID
   */
  async getWorkoutPlanById(planId) {
    return apiClient.get(`/api/v1/workout-plans/${planId}`);
  },

  /**
   * Створити новий план тренування
   */
  async createWorkoutPlan(planData) {
    return apiClient.post('/api/v1/workout-plans', planData);
  },

  /**
   * Оновити план тренування
   */
  async updateWorkoutPlan(planId, planData) {
    return apiClient.put(`/api/v1/workout-plans/${planId}`, planData);
  },

  /**
   * Видалити план тренування
   */
  async deleteWorkoutPlan(planId) {
    return apiClient.delete(`/api/v1/workout-plans/${planId}`);
  },

  /**
   * Видалити окреме тренування (occurrence) з плану
   */
  async deleteOccurrence(planId, occurrenceId, date) {
    return apiClient.delete(`/api/v1/workout-plans/${planId}/occurrence`, {
      occurrenceId,
      date,
    });
  },
};
