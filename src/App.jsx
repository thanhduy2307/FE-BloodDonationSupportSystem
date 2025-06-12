import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import RegisterPage from './Page/register';
import HomePage from './Page/home';
import Dashboard from './components/dashboard';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import LoginPage from './Page/login';


function App() {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },

]);

  return (
    <>
     <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
       <RouterProvider router={router} />
       </PersistGate>
     </Provider>
     

    </>
  )
}

export default App