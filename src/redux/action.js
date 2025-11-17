import {appActions} from './slices/appSlice';

export const {
  createNewClients,
  updateClientsArray,
  toggleCreateClientBtn,
  removeLastClient,
  isPlusMenuBtn,
  safeUserData,
  createNewProgram,
  updateProgramsArray,
  updateClientProgram,
  updateClientParameters,
  getPinningClientId,
  createWorkoutPlan,
  removeWorkoutPlanItem,
  removeClientWorkoutPlanItem,
} = appActions;

export {appActions};
