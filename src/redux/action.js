import {appActions} from './slices/appSlice';

export const {
  createNewClients,
  updateClientsArray,
  toggleCreateClientBtn,
  setPlusMenuBtn,
  saveUserData,
  createNewProgram,
  updateProgramsArray,
  updateClientProgram,
  updateClientParameters,
  setPinningClientId,
  updateCurrentTime,
  createWorkoutPlan,
  removeWorkoutPlanItem,
  removeClientWorkoutPlanItem,
} = appActions;

export {appActions};
