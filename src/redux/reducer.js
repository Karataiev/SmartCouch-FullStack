import {
  ADD_CLIENT,
  GET_CURRENT_TIME,
  GET_STATUS_BAR_BACKGROUND,
} from './action';

const defaultState = {
  statusBarBackground: '#292929',
  currentTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
  clientsData: [],
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CURRENT_TIME:
      return {...state, currentTime: action.payload};
    case ADD_CLIENT:
      return {...state, clientsData: [...state.clientsData, action.payload]};
    case GET_STATUS_BAR_BACKGROUND:
      return {
        ...state,
        statusBarBackground: action.payload,
      };

    default:
      return state;
  }
};
