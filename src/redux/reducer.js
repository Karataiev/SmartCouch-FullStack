import {agendaData} from '../mocks/agendaData';
import {
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
  REMOVE_WORKOUT_PLAN_ITEM,
  REMOVE_CLIENT_WORKOUT_PLAN_ITEM,
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
          const matchingTrainings = Array.isArray(trainingDate)
            ? trainingDate.filter(td => {
                const hour = plan.timeId.split(':')[0];
                const newHour = td.time[0].slice(0, 2);
                return hour === newHour;
              })
            : [];

          if (!matchingTrainings.length) return plan;

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

    case REMOVE_WORKOUT_PLAN_ITEM: {
      const [itemId, selectedDateRaw] = action.payload;
      const selectedDate = String(selectedDateRaw).trim();

      return {
        ...state,
        workoutPlanArr: state.workoutPlanArr.map(plan => ({
          ...plan,
          trainings: plan.trainings.flatMap(tr => {
            if (tr.id !== itemId) return [tr];
            const tDate = tr.trainingDate;
            if (!tDate) return [];

            if (!Array.isArray(tDate)) {
              const singleDate =
                typeof tDate.date === 'object' && tDate.date?.date
                  ? String(tDate.date.date).trim()
                  : String(tDate.date).trim();

              if (singleDate === selectedDate) {
                return [];
              }
              return [tr];
            }

            if (tDate.length === 1) {
              return [];
            }

            const updatedDates = tDate.filter(d => {
              const dValue =
                typeof d.date === 'object' && d.date?.date
                  ? String(d.date.date).trim()
                  : String(d.date).trim();
              return dValue !== selectedDate;
            });

            if (updatedDates.length === 0) {
              return [];
            }
            return [
              {
                ...tr,
                trainingDate: updatedDates,
              },
            ];
          }),
        })),
      };
    }
    case REMOVE_CLIENT_WORKOUT_PLAN_ITEM: {
      return {
        ...state,
        workoutPlanArr: state.workoutPlanArr.map(plan => ({
          ...plan,
          trainings: plan.trainings.filter(tr => tr.id !== action.payload),
        })),
      };
    }

    default:
      return state;
  }
};
