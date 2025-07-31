import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import InlineLoader from "../components/ui/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <InlineLoader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
