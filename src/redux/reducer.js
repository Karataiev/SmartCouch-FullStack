import {
  GET_CURRENT_TIME,
  ADD_CONNECTION_METHOD,
  REMOVE_CONNECTION_METHOD,
  CREATE_NEW_CLIENTS,
  TOGGLE_CREATE_CLIENT_BTN,
  REMOVE_LAST_CLIENT,
  HANDLE_PLUS_MENU_BTN,
} from './action';

const defaultState = {
  currentTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
  connectionMethods: [],
  clients: [],
  isCreateClientBtn: false,
  isPlusMenuBtn: false,
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CURRENT_TIME:
      return {...state, currentTime: action.payload};
    case ADD_CONNECTION_METHOD:
      return {
        ...state,
        connectionMethods: [...state.connectionMethods, action.payload],
      };
    case REMOVE_CONNECTION_METHOD:
      return {
        ...state,
        connectionMethods: [...action.payload],
      };
    case CREATE_NEW_CLIENTS:
      return {
        ...state,
        clients: [...state.clients, action.payload],
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

    default:
      return state;
  }
};
