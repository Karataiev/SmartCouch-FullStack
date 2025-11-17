import {createSlice, nanoid} from '@reduxjs/toolkit';
import {agendaData} from '../../mocks/agendaData';

const initialState = {
  currentTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
  clients: [],
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
  workoutPlanArr: agendaData,
};

const normalizeDateValue = value => {
  if (typeof value?.date === 'object' && value.date?.date) {
    return String(value.date.date).trim();
  }
  return String(value?.date ?? value ?? '').trim();
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    createNewClients: (state, action) => {
      state.clients.push(action.payload);
    },
    removeLastClient: (state, action) => {
      state.clients = [...action.payload];
    },
    updateClientsArray: (state, action) => {
      state.clients = [...action.payload];
    },
    toggleCreateClientBtn: (state, action) => {
      state.isCreateClientBtn = action.payload;
    },
    isPlusMenuBtn: (state, action) => {
      state.isPlusMenuBtn = action.payload;
    },
    safeUserData: (state, action) => {
      state.userData = action.payload;
    },
    createNewProgram: (state, action) => {
      state.programs.push(action.payload);
    },
    updateProgramsArray: (state, action) => {
      state.programs = [...action.payload];
    },
    updateClientProgram: (state, action) => {
      const {clientId, programInfo} = action.payload;
      const client = state.clients.find(c => c.id === clientId);
      if (client) {
        client.program = {...programInfo};
      }
    },
    updateClientParameters: (state, action) => {
      const {clientId, FirstParamsInfo, SecondParamsInfo} = action.payload;
      const client = state.clients.find(c => c.id === clientId);
      if (client) {
        client.params = [{...FirstParamsInfo}, {...SecondParamsInfo}];
      }
    },
    getPinningClientId: (state, action) => {
      state.pinningClientId = action.payload || null;
    },
    createWorkoutPlan: (state, action) => {
      const {trainingDate} = action.payload;
      if (!Array.isArray(trainingDate) || !trainingDate.length) return;

      state.workoutPlanArr = state.workoutPlanArr.map(plan => {
        const planHour = plan.timeId.split(':')[0];
        const matches = trainingDate.filter(td => {
          const tdHour = td.time?.[0]?.slice(0, 2);
          return tdHour === planHour;
        });

        if (!matches.length) {
          return plan;
        }

        const trainings = matches.map(td => ({
          id: action.payload.id ?? nanoid(),
          ...action.payload,
          trainingDate: td,
        }));

        return {...plan, trainings: [...plan.trainings, ...trainings]};
      });
    },
    removeWorkoutPlanItem: (state, action) => {
      const [itemId, selectedDateRaw] = action.payload;
      const selectedDate = String(selectedDateRaw ?? '').trim();

      state.workoutPlanArr = state.workoutPlanArr.map(plan => ({
        ...plan,
        trainings: plan.trainings.flatMap(tr => {
          if (tr.id !== itemId) {
            return [tr];
          }

          const tDate = tr.trainingDate;
          if (!Array.isArray(tDate)) {
            return normalizeDateValue(tDate) === selectedDate ? [] : [tr];
          }

          if (tDate.length === 1) {
            return [];
          }

          const updatedDates = tDate.filter(d => normalizeDateValue(d) !== selectedDate);
          return updatedDates.length ? [{...tr, trainingDate: updatedDates}] : [];
        }),
      }));
    },
    removeClientWorkoutPlanItem: (state, action) => {
      state.workoutPlanArr = state.workoutPlanArr.map(plan => ({
        ...plan,
        trainings: plan.trainings.filter(tr => tr.id !== action.payload),
      }));
    },
  },
});

export const {actions: appActions, reducer: appReducer} = appSlice;
export default appReducer;

