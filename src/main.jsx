if (import.meta.env.DEV && !localStorage.getItem("appInitialized")) {
  localStorage.clear();
  localStorage.setItem("appInitialized", "true");
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer/>
  </StrictMode>,
)
