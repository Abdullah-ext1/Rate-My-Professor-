import { useAuth } from "./AuthContext.jsx";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}