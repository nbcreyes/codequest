// Route wrapper for pages that should only be accessible when NOT logged in.
// Redirects authenticated users to the dashboard.

import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const GuestRoute = ({ children }) => {
  const { parentToken } = useAuthStore();

  if (parentToken) {
    return <Navigate to="/parent/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;