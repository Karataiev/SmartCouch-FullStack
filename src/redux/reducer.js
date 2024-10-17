import {
  GET_CURRENT_TIME,
  ADD_CONNECTION_METHOD,
  REMOVE_CONNECTION_METHOD,
  CREATE_NEW_CLIENTS,
  TOGGLE_CREATE_CLIENT_BTN,
  REMOVE_LAST_CLIENT,
} from './action';

const defaultState = {
  currentTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
  connectionMethods: [],
  clients: [
    {
      client: {
        name: 'Ігор',
        surname: 'Каратаєв',
        number: '+ 38 099 123 55 06',
        link: [],
      },
      clientsCharacteristics: {
        targetAndWishes: 'targetAndWishes',
        stateOfHealth: 'stateOfHealth',
        levelOfPhysical: 'levelOfPhysical',
        notes: 'notes',
      },
    },
    {
      client: {
        name: 'Аліса',
        surname: 'Рева',
        number: '+ 38 099 123 55 06',
        link: [],
      },
      clientsCharacteristics: {
        targetAndWishes: 'targetAndWishes',
        stateOfHealth: 'stateOfHealth',
        levelOfPhysical: 'levelOfPhysical',
        notes: 'notes',
      },
    },
    {
      client: {
        name: 'Ваня',
        surname: 'Гунько',
        number: '+ 38 099 123 55 06',
        link: [],
      },
      clientsCharacteristics: {
        targetAndWishes: 'targetAndWishes',
        stateOfHealth: 'stateOfHealth',
        levelOfPhysical: 'levelOfPhysical',
        notes: 'notes',
      },
    },
    {
      client: {
        name: 'Рома',
        surname: 'Мед',
        number: '+ 38 099 123 55 06',
        link: [],
      },
      clientsCharacteristics: {
        targetAndWishes: 'targetAndWishes',
        stateOfHealth: 'stateOfHealth',
        levelOfPhysical: 'levelOfPhysical',
        notes: 'notes',
      },
    },
    {
      client: {
        name: 'Ваня',
        surname: 'Гунько',
        number: '+ 38 099 123 55 06',
        link: [],
      },
      clientsCharacteristics: {
        targetAndWishes: 'targetAndWishes',
        stateOfHealth: 'stateOfHealth',
        levelOfPhysical: 'levelOfPhysical',
        notes: 'notes',
      },
    },
    {
      client: {
        name: 'Аліса',
        surname: 'Рева',
        number: '+ 38 099 123 55 06',
        link: [],
      },
      clientsCharacteristics: {
        targetAndWishes: 'targetAndWishes',
        stateOfHealth: 'stateOfHealth',
        levelOfPhysical: 'levelOfPhysical',
        notes: 'notes',
      },
    },
  ],
  isCreateClientBtn: false,
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

    default:
      return state;
  }
};
