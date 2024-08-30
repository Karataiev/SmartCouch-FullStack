import {GET_CURRENT_TIME} from './action';

const defaultState = {
  currentTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CURRENT_TIME:
      return {...state, currentTime: action.payload};

    default:
      return state;
  }
};
