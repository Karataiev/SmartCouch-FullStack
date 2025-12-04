import {createAsyncThunk} from '@reduxjs/toolkit';
import {clientsService} from '../../services/api';
import {transformIdsDeep} from '../../utils/dataTransform';

/**
 * Завантажує список клієнтів з бекенду
 * Завантажує всі сторінки автоматично для тестування великих обсягів даних
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}, {rejectWithValue}) => {
    try {
      const allClients = [];
      let page = params.page || 1;
      const limit = params.limit || 20;
      let hasMore = true;

      // Завантажуємо всі сторінки поки є дані
      while (hasMore) {
        const response = await clientsService.getClients({
          ...params,
          page,
          limit,
        });
        
        // Бекенд повертає { success: true, data: { clients: [...], pagination: {...} } }
        const clients = response.data?.clients || [];
        const pagination = response.data?.pagination || {};
        
        allClients.push(...clients);
        
        // Перевіряємо, чи є ще сторінки
        hasMore = pagination.page < pagination.totalPages;
        page++;
        
        // Захист від нескінченного циклу
        if (page > 100) {
          console.warn('Досягнуто максимальну кількість сторінок (100)');
          break;
        }
      }

      // Трансформуємо _id в id
      const transformedClients = transformIdsDeep(allClients);
      
      // Трансформуємо структуру для компонентів: обгортаємо в { client: {...} } та phone -> number
      return transformedClients.map(clientData => ({
        ...clientData,
        client: {
          name: clientData.name,
          surname: clientData.surname,
          number: clientData.phone || clientData.number, // phone з API -> number для компонентів
          link: clientData.connectionMethods || [], // connectionMethods -> link для компонентів
        },
        clientsCharacteristics: {
          targetAndWishes: clientData.targetAndWishes || '',
          stateOfHealth: clientData.stateOfHealth || '',
          levelOfPhysical: clientData.levelOfPhysical || '',
          notes: clientData.notes || '',
        },
      }));
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
      const transformedClient = transformIdsDeep(response.data);
      
      // Трансформуємо структуру для компонентів
      return {
        ...transformedClient,
        client: {
          name: transformedClient.name,
          surname: transformedClient.surname,
          number: transformedClient.phone || transformedClient.number,
          link: transformedClient.connectionMethods || [],
        },
        clientsCharacteristics: {
          targetAndWishes: transformedClient.targetAndWishes || '',
          stateOfHealth: transformedClient.stateOfHealth || '',
          levelOfPhysical: transformedClient.levelOfPhysical || '',
          notes: transformedClient.notes || '',
        },
      };
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
      const transformedClient = transformIdsDeep(response.data);
      
      // Трансформуємо структуру для компонентів
      return {
        ...transformedClient,
        client: {
          name: transformedClient.name,
          surname: transformedClient.surname,
          number: transformedClient.phone || transformedClient.number,
          link: transformedClient.connectionMethods || [],
        },
        clientsCharacteristics: {
          targetAndWishes: transformedClient.targetAndWishes || '',
          stateOfHealth: transformedClient.stateOfHealth || '',
          levelOfPhysical: transformedClient.levelOfPhysical || '',
          notes: transformedClient.notes || '',
        },
      };
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
