import {createAsyncThunk} from '@reduxjs/toolkit';
import {clientsService} from '../../services/api';
import {transformIdsDeep} from '../../utils/dataTransform';

/**
 * Завантажує список клієнтів з бекенду
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}, {rejectWithValue}) => {
    try {
      const response = await clientsService.getClients(params);
      // Бекенд повертає { success: true, data: { clients: [...], pagination: {...} } }
      const clients = response.data?.clients || [];
      // Трансформуємо _id в id
      return transformIdsDeep(clients);
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка завантаження клієнтів');
    }
  },
);

/**
 * Зберігає клієнта на бекенді
 */
export const saveClient = createAsyncThunk(
  'clients/saveClient',
  async (clientData, {rejectWithValue}) => {
    try {
      if (!clientData || typeof clientData !== 'object') {
        throw new Error('Невалідні дані клієнта');
      }

      const response = await clientsService.createClient(clientData);
      // Бекенд повертає { success: true, message: '...', data: client }
      // Трансформуємо _id в id
      return transformIdsDeep(response.data);
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка збереження клієнта');
    }
  },
);

/**
 * Оновлює клієнта на бекенді
 */
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({clientId, clientData}, {rejectWithValue}) => {
    try {
      if (!clientId || !clientData || typeof clientData !== 'object') {
        throw new Error('Невалідні дані для оновлення');
      }

      const response = await clientsService.updateClient(clientId, clientData);
      // Бекенд повертає { success: true, message: '...', data: client }
      // Трансформуємо _id в id
      return transformIdsDeep(response.data);
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка оновлення клієнта');
    }
  },
);

/**
 * Видаляє клієнта з бекенду
 */
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId, {rejectWithValue}) => {
    try {
      if (!clientId) {
        throw new Error('Невалідний ID клієнта');
      }

      await clientsService.deleteClient(clientId);
      // Бекенд повертає { success: true, message: '...' }
      return clientId;
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка видалення клієнта');
    }
  },
);
