import {agendaData} from '../mocks/agendaData';
import {
  GET_CURRENT_TIME,
  CREATE_NEW_CLIENTS,
  TOGGLE_CREATE_CLIENT_BTN,
  REMOVE_LAST_CLIENT,
  HANDLE_PLUS_MENU_BTN,
  SAFE_USER_DATA,
  UPDATE_CLIENTS_ARRAY,
  CREATE_NEW_PROGRAM,
  UPDATE_PROGRAMS_ARRAY,
  UPDATE_CLIENT_PROGRAM,
  UPDATE_CLIENT_PARAMETERS,
  GET_PINNING_CLIENT_ID,
  CREATE_WORKOUT_PLAN,
} from './action';

const defaultState = {
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

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CURRENT_TIME:
      return {...state, currentTime: action.payload};
    case CREATE_NEW_CLIENTS:
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };
    case UPDATE_CLIENTS_ARRAY:
      return {
        ...state,
        clients: [...action.payload],
      };
    case TOGGLE_CREATE_CLIENT_BTN:
      return {
        ...state,
        isCreateClientBtn: action.payload,
      };
    case REMOVE_LAST_CLIENT:
      return {
        ...state,
        clients: [...action.payload],
      };
    case HANDLE_PLUS_MENU_BTN:
      return {
        ...state,
        isPlusMenuBtn: action.payload,
      };
    case SAFE_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case CREATE_NEW_PROGRAM:
      return {
        ...state,
        programs: [...state.programs, action.payload],
      };
    case UPDATE_PROGRAMS_ARRAY:
      return {
        ...state,
        programs: [...action.payload],
      };
    case UPDATE_CLIENT_PROGRAM: {
      const {clientId, programInfo} = action.payload;

      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === clientId
            ? {...client, program: {...programInfo}}
            : client,
        ),
      };
    }
    case UPDATE_CLIENT_PARAMETERS: {
      const {clientId, FirstParamsInfo, SecondParamsInfo} = action.payload;

      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === clientId
            ? {...client, params: [{...FirstParamsInfo}, {...SecondParamsInfo}]}
            : client,
        ),
      };
    }
    case GET_PINNING_CLIENT_ID:
      return {
        ...state,
        pinningClientId: action.payload || null,
      };
    case CREATE_WORKOUT_PLAN: {
      const {trainingDate} = action.payload;

      return {
        ...state,
        workoutPlanArr: state.workoutPlanArr.map(plan => {
          const matchingTrainings = trainingDate.filter(td => {
            const hour = plan.timeId.split(':')[0];
            const newHour = td.time[0].slice(0, 2);
            return hour === newHour;
          });

          if (matchingTrainings.length === 0) {
            return plan;
          }

          const newTrainings = matchingTrainings.map(td => ({
            ...action.payload,
            trainingDate: td,
          }));

          return {
            ...plan,
            trainings: [...plan.trainings, ...newTrainings],
          };
        }),
      };
    }
    default:
      return state;
  }
};
