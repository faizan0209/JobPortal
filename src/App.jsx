import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./components/Routes";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/About";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import PostJob from "./components/PostJob";
import ManageUsers from "./components/ManageUsers";
import JobApplication from "./components/JobApplications";
import UserDashboard from "./components/UserDashboard";
import { AuthProvider } from "./context/authContext";
import Notification from "./components/Notification";
import HistoryPage from "./components/HistoryPage";
// import ProtectedRoute from "./components/ProtectedRoutes";
function App() {
  // Define the router for routing
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Routes />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
        {
          path: "/post-job", // Change this path to match the link
          element: <PostJob />,
        },
        {
          path: "/manage-users", // Change this path to match the link
          element: <ManageUsers />,
        },
        {
          path: "/applications", // Change this path to match the link
          element: <JobApplication />,
        },
        {
          path: "/userPage", // Change this path to match the link
          element: <UserDashboard />,
        },
        {
          path: "/notification", // Change this path to match the link
          element: <Notification/>,
        },
        {
          path: "/history", // Change this path to match the link
          element: <HistoryPage/>,
        },
      ],
    },
  ]);

  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
