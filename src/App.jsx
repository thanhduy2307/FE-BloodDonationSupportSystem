import React, { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
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
import ManageFeedback from "./Page/dashboard-admin/feedback";
import Dashboard from "./components/dashboard";
import DashboardStaff from "./components/dashboard/dashboardstaff";
import StaffFeedback from "./Page/dashboard-staff/feedback";
import StaffMember from "./Page/dashboard-staff/member";
import BloodDonationList from "./Page/dashboard-admin/blood-donor";
import ManageBlogs from "./Page/dashboard-staff/blogs";
import NotificationPage from "./Page/dashboard-staff/notification";
import EventTable from "./Page/dashboard-staff/donationEvent";
import BloodHistoryPage from "./Page/history";
import BloodRequestListAdmin from "./Page/dashboard-admin/requestBlood";
import BloodDonationListt from "./Page/dashboard-staff/blood-donor";
import BloodRequestList from "./Page/dashboard-staff/request-blood";
import NotificationUser from "./Page/notification";
import * as Sentry from "@sentry/react";
import { ToastContainer } from 'react-toastify';
import SentryRouteTracker from "./SentryRouteTracker";
<ToastContainer position="top-right" autoClose={3000} />


function App() {
  useEffect(() => {
    // test tự động gửi lỗi sau 2 giây
    setTimeout(() => {
      Sentry.captureException(new Error("🔥 Lỗi test gửi lên Sentry"));
    }, 2000);
  }, []);
  const router = createBrowserRouter([
    {
      path: "",
      element:(
        <>
        <SentryRouteTracker /> 
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
        {
          path: "feedback",
          element: <ManageFeedback />,
        },
        {
          path: "bloodDonor",
          element: <BloodDonationList/>
        },
        {
          path: "requestBlood",
          element: <BloodRequestListAdmin/>
        },
      ],
    },
    {
      path: "/dashboard-staff",
      element: <DashboardStaff/>,
      children: [
        {
          path: "feedback-staff",
          element: <StaffFeedback />,
        },
        {
          path: "member-staff",
          element: <StaffMember />,
        },
        {
          path: "donorList-staff",
          element: <BloodDonationListt/>
        },
         {
          path: "requestList-staff",
          element:<BloodRequestList/>
        },
         {
          path: "manageBlogs",
          element: <ManageBlogs/>
        },
         {
          path: "notification",
          element: <NotificationPage/>
        },
        {
          path: "eventStaff",
          element: <EventTable/>
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
     {
      path: "history",
      element: <BloodHistoryPage />,
    },
    {
      path: "notificationn",
      element: <NotificationUser />,
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
