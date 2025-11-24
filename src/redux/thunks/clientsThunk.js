import {createAsyncThunk} from '@reduxjs/toolkit';

/**
 * Завантажує список клієнтів з бекенду
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, {rejectWithValue}) => {
    try {
      // TODO: Замінити на реальний API запит
      // const response = await fetch('/api/clients');
      // if (!response.ok) throw new Error('Failed to fetch clients');
      // return await response.json();
      
      // Заглушка для розробки
      return [];
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

      // TODO: Замінити на реальний API запит
      // const response = await fetch('/api/clients', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify(clientData),
      // });
      // if (!response.ok) throw new Error('Failed to save client');
      // return await response.json();
      
      // Заглушка для розробки
      return clientData;
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

      // TODO: Замінити на реальний API запит
      // const response = await fetch(`/api/clients/${clientId}`, {
      //   method: 'PUT',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify(clientData),
      // });
      // if (!response.ok) throw new Error('Failed to update client');
      // return await response.json();
      
      // Заглушка для розробки
      return {id: clientId, ...clientData};
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

      // TODO: Замінити на реальний API запит
      // const response = await fetch(`/api/clients/${clientId}`, {
      //   method: 'DELETE',
      // });
      // if (!response.ok) throw new Error('Failed to delete client');
      // return clientId;
      
      // Заглушка для розробки
      return clientId;
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка видалення клієнта');
    }
  },
);




