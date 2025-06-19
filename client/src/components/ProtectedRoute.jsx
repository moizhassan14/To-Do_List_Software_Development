import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, screenLoading } = useSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    if (!screenLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, screenLoading, navigate]);

  if (screenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
