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
import Header from "./components/home-template/Header";
import { Footer } from "antd/es/layout/layout";
import RegisterForm from "./Page/register-form-blood";
import UserProfile from "./Page/profileUsers";
import Blogs from "./Page/blogs";
import EventPage from "./Page/events";
import Feedback from "./Page/feedback";
import RequestForm from "./Page/register-form-request-blood";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },

        {
          path: "blogs",
          element: <Blogs />,
        },
        {
          path: "events",
          element:<EventPage/>,
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
    {
      path: "profile",
      element: <UserProfile />,
    },
    {
      path: "registerForm",
      element: <RegisterForm />,
    },
     {
      path: "feedback",
      element: <Feedback />,
    },
    {
      path: "requestForm",
      element: <RequestForm/>,
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
