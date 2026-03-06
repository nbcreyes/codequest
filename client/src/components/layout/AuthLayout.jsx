// Layout wrapper for all auth pages (login, register, etc.)
// Provides the centered card with CodeQuest branding.

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-quest-50 via-white to-quest-100 flex items-center justify-center p-4">

      {/* Background decorative circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-quest-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-4xl text-quest-600">
              CodeQuest
            </h1>
          </Link>
          <p className="font-body text-slate-500 text-sm mt-1">
            Learn Python through adventure
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-4xl shadow-quest-lg p-8 border border-quest-100">
          {title && (
            <div className="mb-6 text-center">
              <h2 className="font-display text-2xl text-slate-800">{title}</h2>
              {subtitle && (
                <p className="font-body text-slate-500 text-sm mt-2">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;