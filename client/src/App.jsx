// Root component — defines all routes and renders the toast container.

import { Routes, Route, Navigate } from "react-router-dom";
import ToastContainer from "@/components/ui/Toast";

// Route guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import ChildRoute from "@/components/shared/ChildRoute";
import GuestRoute from "@/components/shared/GuestRoute";

// Auth pages
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import CheckEmailPage from "@/pages/auth/CheckEmailPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Parent pages
import DashboardPage from "@/pages/parent/DashboardPage";

// Child pages
import WorldMapPage from "@/pages/child/WorldMapPage";
import ChapterPage from "@/pages/child/ChapterPage";

const App = () => {
  return (
    <>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Guest-only auth routes */}
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

        {/* Email flow — accessible regardless of auth state */}
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Protected parent routes */}
        <Route path="/parent/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        {/* Protected child session routes */}
        <Route path="/play" element={<ChildRoute><WorldMapPage /></ChildRoute>} />
        <Route path="/play/chapter/:id" element={<ChildRoute><ChapterPage /></ChildRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Toast notifications render on top of everything */}
      <ToastContainer />
    </>
  );
};

export default App;