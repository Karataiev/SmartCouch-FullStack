export const GET_CURRENT_TIME = 'GET_CURRENT_TIME';
export const ADD_CLIENT = 'ADD_CLIENT';
export const GET_STATUS_BAR_BACKGROUND = 'GET_STATUS_BAR_BACKGROUND';

export const getCurrentTime = payload => {
  return {type: GET_CURRENT_TIME, payload: payload};
};

export const addClient = payload => {
  return {type: ADD_CLIENT, payload: payload};
};

export const getStatusBarBackground = payload => {
  return {type: GET_STATUS_BAR_BACKGROUND, payload: payload};
};
