import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {agendaData} from '../../mocks/agendaData';
import {
  attachTrainingToAgenda,
  buildAgendaState,
  createTrainingEntity,
  detachOccurrencesFromAgenda,
  detachTrainingFromAgenda,
  removeOccurrenceByDate,
} from '../utils/workoutPlanUtils';
import {
  fetchClients,
  saveClient,
  updateClient,
  deleteClient,
} from '../thunks/clientsThunk';
import {
  fetchWorkoutPlans,
  fetchWorkoutPlansByDate,
  saveWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from '../thunks/workoutPlansThunk';

const clientsAdapter = createEntityAdapter();
const trainingsAdapter = createEntityAdapter();

const initialState = {
  currentTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
  clients: clientsAdapter.getInitialState(),
  userData: {
    name: '',
    surname: '',
    number: '',
    email: '',
    birthday: '',
    experience: '',
    city: '',
  },
  isCreateClientBtn: false,
  isPlusMenuBtn: false,
  programs: [],
  pinningClientId: '',
  trainings: trainingsAdapter.getInitialState(),
  agenda: buildAgendaState(agendaData),
  loading: {
    clients: false,
    workoutPlans: false,
  },
  error: {
    clients: null,
    workoutPlans: null,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    createNewClients: (state, action) => {
      if (action.payload) {
        clientsAdapter.addOne(state.clients, action.payload);
      }
    },
    updateClientsArray: (state, action) => {
      const clientsArray = Array.isArray(action.payload) ? action.payload : [];
      clientsAdapter.setAll(state.clients, clientsArray);
    },
    toggleCreateClientBtn: (state, action) => {
      state.isCreateClientBtn = action.payload;
    },
    setPlusMenuBtn: (state, action) => {
      state.isPlusMenuBtn = action.payload;
    },
    saveUserData: (state, action) => {
      if (action.payload && typeof action.payload === 'object') {
        state.userData = action.payload;
      }
    },
    createNewProgram: (state, action) => {
      if (action.payload) {
        state.programs.push(action.payload);
      }
    },
    updateProgramsArray: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.programs = action.payload;
      }
    },
    updateClientProgram: (state, action) => {
      if (!action.payload || typeof action.payload !== 'object') {
        return;
      }
      const {clientId, programInfo} = action.payload;
      if (!clientId || !programInfo) {
        return;
      }
      const client = state.clients.entities[clientId];
      if (client) {
        client.program = {...programInfo};
      }
    },
    updateClientParameters: (state, action) => {
      if (!action.payload || typeof action.payload !== 'object') {
        return;
      }
      const {clientId, FirstParamsInfo, SecondParamsInfo} = action.payload;
      if (!clientId || !FirstParamsInfo || !SecondParamsInfo) {
        return;
      }
      const client = state.clients.entities[clientId];
      if (client) {
        client.params = [{...FirstParamsInfo}, {...SecondParamsInfo}];
      }
    },
    setPinningClientId: (state, action) => {
      state.pinningClientId = action.payload || null;
    },
    updateCurrentTime: (state, action) => {
      if (action.payload && typeof action.payload === 'string') {
        state.currentTime = action.payload;
      }
    },
    createWorkoutPlan: (state, action) => {
      if (!action.payload || typeof action.payload !== 'object') {
        return;
      }
      if (!action.payload.trainingDate) {
        return;
      }
      const training = createTrainingEntity(action.payload);
      if (!training) {
        return;
      }
      const existingTraining = state.trainings.entities[training.id];
      if (existingTraining) {
        detachTrainingFromAgenda(state.agenda, existingTraining);
      }
      trainingsAdapter.upsertOne(state.trainings, training);
      attachTrainingToAgenda(state.agenda, training);
    },
    removeWorkoutPlanItem: (state, action) => {
      const [trainingId, selectedDate] = action.payload;
      if (!trainingId || !selectedDate) {
        return;
      }
      const training = state.trainings.entities[trainingId];
      if (!training) {
        return;
      }

      const {updatedTraining, removedOccurrenceIds} = removeOccurrenceByDate(
        training,
        selectedDate,
      );
      if (!removedOccurrenceIds.length) {
        return;
      }

      detachOccurrencesFromAgenda(state.agenda, trainingId, removedOccurrenceIds);

      if (!updatedTraining?.occurrences?.length) {
        trainingsAdapter.removeOne(state.trainings, trainingId);
        return;
      }

      trainingsAdapter.upsertOne(state.trainings, updatedTraining);
    },
    removeClientWorkoutPlanItem: (state, action) => {
      const trainingId = action.payload;
      if (!trainingId) {
        return;
      }
      const training = state.trainings.entities[trainingId];
      if (!training) {
        return;
      }
      detachTrainingFromAgenda(state.agenda, training);
      trainingsAdapter.removeOne(state.trainings, trainingId);
    },
  },
  extraReducers: builder => {
    // Clients thunks
    builder
      .addCase(fetchClients.pending, state => {
        state.loading.clients = true;
        state.error.clients = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading.clients = false;
        if (Array.isArray(action.payload)) {
          clientsAdapter.setAll(state.clients, action.payload);
        }
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading.clients = false;
        state.error.clients = action.payload || 'Помилка завантаження клієнтів';
      })
      .addCase(saveClient.pending, state => {
        state.loading.clients = true;
        state.error.clients = null;
      })
      .addCase(saveClient.fulfilled, (state, action) => {
        state.loading.clients = false;
        if (action.payload) {
          clientsAdapter.addOne(state.clients, action.payload);
        }
      })
      .addCase(saveClient.rejected, (state, action) => {
        state.loading.clients = false;
        state.error.clients = action.payload || 'Помилка збереження клієнта';
      })
      .addCase(updateClient.pending, state => {
        state.loading.clients = true;
        state.error.clients = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading.clients = false;
        if (action.payload?.id) {
          clientsAdapter.upsertOne(state.clients, action.payload);
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading.clients = false;
        state.error.clients = action.payload || 'Помилка оновлення клієнта';
      })
      .addCase(deleteClient.pending, state => {
        state.loading.clients = true;
        state.error.clients = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading.clients = false;
        if (action.payload) {
          clientsAdapter.removeOne(state.clients, action.payload);
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading.clients = false;
        state.error.clients = action.payload || 'Помилка видалення клієнта';
      });

    // Workout plans thunks
    builder
      .addCase(fetchWorkoutPlans.pending, state => {
        state.loading.workoutPlans = true;
        state.error.workoutPlans = null;
      })
      .addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
        state.loading.workoutPlans = false;
        if (Array.isArray(action.payload)) {
          action.payload.forEach(plan => {
            const training = createTrainingEntity(plan);
            if (training) {
              trainingsAdapter.upsertOne(state.trainings, training);
              attachTrainingToAgenda(state.agenda, training);
            }
          });
        }
      })
      .addCase(fetchWorkoutPlans.rejected, (state, action) => {
        state.loading.workoutPlans = false;
        state.error.workoutPlans =
          action.payload || 'Помилка завантаження планів тренувань';
      })
      .addCase(fetchWorkoutPlansByDate.pending, state => {
        state.loading.workoutPlans = true;
        state.error.workoutPlans = null;
      })
      .addCase(fetchWorkoutPlansByDate.fulfilled, (state, action) => {
        state.loading.workoutPlans = false;
        if (Array.isArray(action.payload)) {
          action.payload.forEach(plan => {
            const training = createTrainingEntity(plan);
            if (training) {
              trainingsAdapter.upsertOne(state.trainings, training);
              attachTrainingToAgenda(state.agenda, training);
            }
          });
        }
      })
      .addCase(fetchWorkoutPlansByDate.rejected, (state, action) => {
        state.loading.workoutPlans = false;
        state.error.workoutPlans =
          action.payload || 'Помилка завантаження планів тренувань';
      })
      .addCase(saveWorkoutPlan.pending, state => {
        state.loading.workoutPlans = true;
        state.error.workoutPlans = null;
      })
      .addCase(saveWorkoutPlan.fulfilled, (state, action) => {
        state.loading.workoutPlans = false;
        if (action.payload) {
          const training = createTrainingEntity(action.payload);
          if (training) {
            const existingTraining = state.trainings.entities[training.id];
            if (existingTraining) {
              detachTrainingFromAgenda(state.agenda, existingTraining);
            }
            trainingsAdapter.upsertOne(state.trainings, training);
            attachTrainingToAgenda(state.agenda, training);
          }
        }
      })
      .addCase(saveWorkoutPlan.rejected, (state, action) => {
        state.loading.workoutPlans = false;
        state.error.workoutPlans =
          action.payload || 'Помилка збереження плану тренування';
      })
      .addCase(updateWorkoutPlan.pending, state => {
        state.loading.workoutPlans = true;
        state.error.workoutPlans = null;
      })
      .addCase(updateWorkoutPlan.fulfilled, (state, action) => {
        state.loading.workoutPlans = false;
        if (action.payload) {
          const training = createTrainingEntity(action.payload);
          if (training) {
            const existingTraining = state.trainings.entities[training.id];
            if (existingTraining) {
              detachTrainingFromAgenda(state.agenda, existingTraining);
            }
            trainingsAdapter.upsertOne(state.trainings, training);
            attachTrainingToAgenda(state.agenda, training);
          }
        }
      })
      .addCase(updateWorkoutPlan.rejected, (state, action) => {
        state.loading.workoutPlans = false;
        state.error.workoutPlans =
          action.payload || 'Помилка оновлення плану тренування';
      })
      .addCase(deleteWorkoutPlan.pending, state => {
        state.loading.workoutPlans = true;
        state.error.workoutPlans = null;
      })
      .addCase(deleteWorkoutPlan.fulfilled, (state, action) => {
        state.loading.workoutPlans = false;
        if (action.payload) {
          const training = state.trainings.entities[action.payload];
          if (training) {
            detachTrainingFromAgenda(state.agenda, training);
            trainingsAdapter.removeOne(state.trainings, action.payload);
          }
        }
      })
      .addCase(deleteWorkoutPlan.rejected, (state, action) => {
        state.loading.workoutPlans = false;
        state.error.workoutPlans =
          action.payload || 'Помилка видалення плану тренування';
      });
  },
});

export const {actions: appActions, reducer: appReducer} = appSlice;
export default appReducer;

const selectClientsState = state => state.app.clients;
const selectTrainingsState = state => state.app.trainings;

export const clientsSelectors = clientsAdapter.getSelectors(selectClientsState);
export const trainingsSelectors = trainingsAdapter.getSelectors(selectTrainingsState);

