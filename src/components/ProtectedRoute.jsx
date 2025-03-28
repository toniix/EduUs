import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// This component is used to protect routes that require authentication

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
