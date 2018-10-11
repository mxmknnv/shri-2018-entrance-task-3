import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AppContainer from './containers/AppContainer';
import reduxStore from './reduxStore';

import '../styles/index.css';

ReactDOM.render(
  <Provider store={reduxStore}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);
