// Route wrapper that requires a valid parent token.
// Redirects to /login if not authenticated.

import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const ProtectedRoute = ({ children }) => {
  const { parentToken } = useAuthStore();
  const location = useLocation();

  if (!parentToken) {
    // Pass the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;