import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { persistStore } from 'redux-persist';
import { store } from './redux/store.js'
if (import.meta.env.DEV && !localStorage.getItem("appInitialized")) {
  localStorage.clear();
  persistStore(store).purge();
  localStorage.setItem("appInitialized", "true"); // ✅ đánh dấu đã xoá
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer/>
  </StrictMode>,
)
