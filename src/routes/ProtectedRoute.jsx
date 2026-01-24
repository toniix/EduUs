import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import InlineLoader from "../components/ui/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <InlineLoader />;
  }

  if (!profile) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
