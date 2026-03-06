import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerParent } from "@/services/authService";
import useUiStore from "@/store/uiStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: registerParent,
    onSuccess: () => {
      navigate("/check-email", { state: { email: form.email } });
    },
    onError: (error) => {
      const data = error.response?.data;

      if (data?.errors) {
        // Map server validation errors to field errors
        const fieldErrors = {};
        data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        addToast({
          type: "error",
          message: data?.message || "Registration failed. Please try again.",
        });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutate(form);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your child's coding adventure today"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          helperText="At least 8 characters, one uppercase letter, one number"
          required
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="mt-2">
          <Button type="submit" isLoading={isPending} className="w-full" size="lg">
            Create account
          </Button>
        </div>

        <p className="text-center text-sm font-body text-slate-500 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-quest-600 font-600 hover:underline">
            Log in
          </Link>
        </p>

        <p className="text-center text-xs font-body text-slate-400 mt-1">
          By creating an account you agree to be responsible for your
          child's usage in accordance with COPPA guidelines.
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;