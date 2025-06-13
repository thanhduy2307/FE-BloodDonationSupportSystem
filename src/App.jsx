import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";



import Dashboard from "./components/dashboard";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import LoginPage from "./Page/login";
import RegisterPage from "./Page/register";
import OverviewPage from "./Page/dashboard-admin/overview";
import ManageUser from "./Page/dashboard-admin/member";
import HomePage from "./Page/home";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: (
        <>
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "about",
          element: <div>about</div>,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "overview",
          element: <OverviewPage />,
        },
        {
          path: "user",
          element: <ManageUser />,
        },
      ],
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
  );
}

export default App;