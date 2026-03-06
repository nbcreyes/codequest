// Route wrapper that requires an active child session token.
// Redirects to parent dashboard if no child session is active.

import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const ChildRoute = ({ children }) => {
  const { childToken, parentToken } = useAuthStore();

  if (!parentToken) {
    return <Navigate to="/login" replace />;
  }

  if (!childToken) {
    return <Navigate to="/parent/dashboard" replace />;
  }

  return children;
};

export default ChildRoute;