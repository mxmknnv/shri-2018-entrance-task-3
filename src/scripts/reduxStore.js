import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';

import reducers from './reducers';

const state = {
  popup: {
    isActive: false,
    emoji: '',
    title: '',
    lines: [],
    buttons: [],
  },
  interface: {
    activeSection: 'table',
  },
  redactor: {
    mode: null,
    setup: {},
  },
  data: {
    events: {
      data: [],
      date: null,
      isLoading: false,
      isSuccess: false,
      isFailure: false,
    },
    rooms: {
      data: [],
      isLoading: false,
      isSuccess: false,
      isFailure: false,
    },
    users: {
      data: [],
      isLoading: false,
      isSuccess: false,
      isFailure: false,
    },
  },
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxStore = createStore(
  reducers,
  state,
  composeEnhancers(applyMiddleware(promise, thunk)),
);

export default reduxStore;
