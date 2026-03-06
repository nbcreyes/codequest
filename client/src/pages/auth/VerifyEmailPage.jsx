import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { verifyEmail } from "@/services/authService";
import useAuthStore from "@/store/authStore";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const setParentAuth = useAuthStore((s) => s.setParentAuth);
  const hasRun = useRef(false);

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: () => verifyEmail(token),
    onSuccess: (data) => {
      setParentAuth(data.data.token, data.data.parent);
      setTimeout(() => {
        navigate("/parent/dashboard", { replace: true });
      }, 2000);
    },
  });

  useEffect(() => {
    // useRef guard prevents double-firing in React StrictMode
    if (token && !hasRun.current) {
      hasRun.current = true;
      mutate();
    }
  }, [token]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center gap-6 py-4">
        {isPending && (
          <>
            <Spinner size="lg" />
            <p className="font-display text-xl text-slate-700">
              Verifying your email...
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </motion.div>
            <div>
              <h2 className="font-display text-2xl text-slate-800">
                Email verified!
              </h2>
              <p className="font-body text-slate-500 mt-2 text-sm">
                Welcome to CodeQuest. Taking you to your dashboard...
              </p>
            </div>
          </>
        )}

        {isError && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center"
            >
              <XCircle className="w-10 h-10 text-coral-500" />
            </motion.div>
            <div>
              <h2 className="font-display text-2xl text-slate-800">
                Link expired
              </h2>
              <p className="font-body text-slate-500 mt-2 text-sm">
                {error?.response?.data?.message ||
                  "This verification link is invalid or has expired."}
              </p>
            </div>
            <Button
              onClick={() => navigate("/check-email")}
              className="w-full"
            >
              Request a new link
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;