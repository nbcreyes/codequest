// Shown after registration — tells the parent to check their email.

import { useLocation, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import { resendVerification } from "@/services/authService";
import useUiStore from "@/store/uiStore";

const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const addToast = useUiStore((s) => s.addToast);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => resendVerification(email),
    onSuccess: () => {
      addToast({ type: "success", message: "Verification email resent." });
    },
    onError: () => {
      addToast({ type: "error", message: "Could not resend email. Please try again." });
    },
  });

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-quest-100 rounded-full flex items-center justify-center"
        >
          <Mail className="w-10 h-10 text-quest-600" />
        </motion.div>

        <div>
          <h2 className="font-display text-2xl text-slate-800">Check your email</h2>
          <p className="font-body text-slate-500 mt-2 text-sm leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-600 text-slate-700">{email || "your email address"}</span>.
            Click the link to activate your account.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="secondary"
            onClick={() => mutate()}
            isLoading={isPending}
            disabled={isSuccess}
            className="w-full"
          >
            {isSuccess ? "Email sent" : "Resend verification email"}
          </Button>

          <Link to="/login" className="text-center text-sm font-body text-slate-500 hover:text-quest-600 transition-colors">
            Back to log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CheckEmailPage;