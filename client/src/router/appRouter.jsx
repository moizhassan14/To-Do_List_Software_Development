import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Login from "../pages/authentication/login/Login.jsx";
import SignUp from "../pages/authentication/signup/Signup.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default router;

