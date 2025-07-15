// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // nếu bạn chưa import file CSS

import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: 'f65571e059f74c88ae8513f8f67a0d4b',
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <ToastContainer />
    </Provider>
  </StrictMode>
);
