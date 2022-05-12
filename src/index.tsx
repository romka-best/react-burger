import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {store} from './services/store';

import './index.module.css';

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import App from './components/App/App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App/>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
