import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { forgotPassword } from "@/services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => setSubmitted(true),
    onError: () => setSubmitted(true), // Always show success to prevent enumeration
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  if (submitted) {
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
              If that email is registered, a password reset link has been sent.
            </p>
          </div>
          <Link to="/login" className="text-sm font-body text-quest-600 hover:underline">
            Back to log in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a reset link"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
        />

        <div className="mt-2">
          <Button type="submit" isLoading={isPending} className="w-full" size="lg">
            Send reset link
          </Button>
        </div>

        <Link
          to="/login"
          className="text-center text-sm font-body text-slate-500 hover:text-quest-600 transition-colors"
        >
          Back to log in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;