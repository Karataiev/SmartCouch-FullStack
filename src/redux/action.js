export const GET_CURRENT_TIME = 'GET_CURRENT_TIME';

export const getCurrentTime = payload => {
  return {type: GET_CURRENT_TIME, payload: payload};
};
