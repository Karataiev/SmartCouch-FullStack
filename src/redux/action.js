export const GET_CURRENT_TIME = 'GET_CURRENT_TIME';
export const ADD_CONNECTION_METHOD = 'ADD_CONNECTION_METHOD';
export const REMOVE_CONNECTION_METHOD = 'REMOVE_CONNECTION_METHOD';
export const CREATE_NEW_CLIENTS = 'CREATE_NEW_CLIENTS';
export const TOGGLE_CREATE_CLIENT_BTN = 'TOGGLE_CREATE_CLIENT_BTN';
export const REMOVE_LAST_CLIENT = 'REMOVE_LAST_CLIENT';
export const HANDLE_PLUS_MENU_BTN = 'HANDLE_PLUS_MENU_BTN';
export const SAFE_USER_DATA = 'SAFE_USER_DATA';

export const getCurrentTime = payload => {
  return {type: GET_CURRENT_TIME, payload: payload};
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

export const removeLastClient = payload => {
  return {type: REMOVE_LAST_CLIENT, payload: payload};
};

export const isPlusMenuBtn = payload => {
  return {type: HANDLE_PLUS_MENU_BTN, payload: payload};
};

export const safeUserData = payload => {
  return {type: SAFE_USER_DATA, payload: payload};
};
