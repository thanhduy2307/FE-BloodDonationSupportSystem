if (import.meta.env.DEV && !localStorage.getItem("appInitialized")) {
  localStorage.clear();
  localStorage.setItem("appInitialized", "true");
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import * as Sentry from "@sentry/react";





const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer/>
  </StrictMode>,
)
