import {apiClient} from './apiClient';

/**
 * Сервіс для роботи з клієнтами
 */
export const clientsService = {
  /**
   * Отримати список клієнтів
   * @param {Object} params - Query параметри (page, limit, search)
   */
  async getClients(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/v1/clients?${queryString}`
      : '/api/v1/clients';
    return apiClient.get(endpoint);
  },

  /**
   * Отримати клієнта по ID
   */
  async getClientById(clientId) {
    return apiClient.get(`/api/v1/clients/${clientId}`);
  },

  /**
   * Створити нового клієнта
   */
  async createClient(clientData) {
    return apiClient.post('/api/v1/clients', clientData);
  },

  /**
   * Оновити клієнта
   */
  async updateClient(clientId, clientData) {
    return apiClient.put(`/api/v1/clients/${clientId}`, clientData);
  },

  /**
   * Видалити клієнта
   */
  async deleteClient(clientId) {
    return apiClient.delete(`/api/v1/clients/${clientId}`);
  },

  /**
   * Оновити параметри клієнта
   */
  async updateParameters(clientId, parameters) {
    return apiClient.put(`/api/v1/clients/${clientId}/parameters`, {
      parameters,
    });
  },

  /**
   * Призначити програму клієнту
   */
  async assignProgram(clientId, programData) {
    return apiClient.put(`/api/v1/clients/${clientId}/program`, programData);
  },

  /**
   * Отримати тренування клієнта
   */
  async getClientTrainings(clientId) {
    return apiClient.get(`/api/v1/clients/${clientId}/trainings`);
  },
};
