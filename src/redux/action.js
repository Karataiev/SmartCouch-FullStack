export const GET_CURRENT_TIME = 'GET_CURRENT_TIME';
export const ADD_CLIENT = 'ADD_CLIENT';
export const GET_STATUS_BAR_BACKGROUND = 'GET_STATUS_BAR_BACKGROUND';
export const ADD_CONNECTION_METHOD = 'ADD_CONNECTION_METHOD';
export const REMOVE_CONNECTION_METHOD = 'REMOVE_CONNECTION_METHOD';
export const CREATE_NEW_CLIENTS = 'CREATE_NEW_CLIENTS';
export const TOGGLE_CREATE_CLIENT_BTN = 'TOGGLE_CREATE_CLIENT_BTN';

export const getCurrentTime = payload => {
  return {type: GET_CURRENT_TIME, payload: payload};
};

export const addClient = payload => {
  return {type: ADD_CLIENT, payload: payload};
};

export const getStatusBarBackground = payload => {
  return {type: GET_STATUS_BAR_BACKGROUND, payload: payload};
};

export const addConnectionMethod = payload => {
  return {type: ADD_CONNECTION_METHOD, payload: payload};
};

export const removeConnectionMethod = payload => {
  return {type: REMOVE_CONNECTION_METHOD, payload: payload};
};

export const createNewClients = payload => {
  return {type: CREATE_NEW_CLIENTS, payload: payload};
};

export const toggleCreateClientBtn = payload => {
  return {type: TOGGLE_CREATE_CLIENT_BTN, payload: payload};
};
