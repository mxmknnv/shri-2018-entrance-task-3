import { combineReducers } from 'redux';

import popupReducer from './popup';
import interfaceReducer from './interface';
import redactorReducer from './redactor';

import eventReducer from './data/event';
import eventsReducer from './data/events';
import roomsReducer from './data/rooms';
import usersReducer from './data/users';

const dataReducer = combineReducers({
  events: eventsReducer,
  rooms: roomsReducer,
  users: usersReducer,
  event: eventReducer,
});

const reducer = combineReducers({
  popup: popupReducer,
  interface: interfaceReducer,
  redactor: redactorReducer,
  data: dataReducer,
});

export default reducer;
