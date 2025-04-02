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

    default:
      return state;
  }
};
