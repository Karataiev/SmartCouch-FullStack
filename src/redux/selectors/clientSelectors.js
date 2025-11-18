import {createSelector} from '@reduxjs/toolkit';
import {clientsSelectors} from '../slices/appSlice';

export const selectClientsList = clientsSelectors.selectAll;
export const selectClientEntities = clientsSelectors.selectEntities;
export const selectClientIds = clientsSelectors.selectIds;
export const selectClientById = clientsSelectors.selectById;

export const selectPinnedClientId = state => state.app.pinningClientId;

export const selectPinnedClient = createSelector(
  [selectPinnedClientId, selectClientEntities],
  (pinnedId, entities) => (pinnedId ? entities[pinnedId] ?? null : null),
);

const selectPrograms = state => state.app.programs;
const selectClientIdForPrograms = (_, clientId) => clientId;

export const selectClientPrograms = createSelector(
  [selectClientEntities, selectClientIdForPrograms, selectPrograms],
  (clientEntities, clientId, allPrograms) => {
    if (!clientId) {
      return null;
    }
    const client = clientEntities[clientId];
    if (!client?.program) {
      return null;
    }
    return client.program;
  },
);


