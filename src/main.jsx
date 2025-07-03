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



Sentry.init({
  dsn: "https://e8b564aabbec7a0df7c7e060d0de61bd@o4509605345755136.ingest.de.sentry.io/4509605378326608",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer/>
  </StrictMode>,
)
