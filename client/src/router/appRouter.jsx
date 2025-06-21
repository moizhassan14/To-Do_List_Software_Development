import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Login from "../pages/authentication/login/Login.jsx";
import SignUp from "../pages/authentication/signup/Signup.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import {ErrorBoundary} from "../components/ErrorBoundary.jsx";
import TaskBoard from "../pages/taskboard/Taskboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <TaskBoard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorBoundary />,
  },
]);

export default router;
