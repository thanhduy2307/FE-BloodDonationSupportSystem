// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';

import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: 'f65571e059f74c88ae8513f8f67a0d4b',
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
};


ReactDOM.createRoot(document.getElementById('root')).render(

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <ToastContainer />
    </Provider>
  </StrictMode>
);
