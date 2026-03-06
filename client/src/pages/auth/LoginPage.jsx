import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginParent } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setParentAuth = useAuthStore((s) => s.setParentAuth);
  const addToast = useUiStore((s) => s.addToast);

  const from = location.state?.from?.pathname || "/parent/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: loginParent,
    onSuccess: (data) => {
      setParentAuth(data.data.token, data.data.parent);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const data = error.response?.data;

      if (data?.code === "EMAIL_NOT_VERIFIED") {
        navigate("/check-email", { state: { email: form.email } });
        return;
      }

      if (data?.errors) {
        const fieldErrors = {};
        data.errors.forEach((e) => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        addToast({
          type: "error",
          message: data?.message || "Login failed. Please try again.",
        });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutate(form);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your parent account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          <Link
            to="/forgot-password"
            className="text-right text-xs font-body text-quest-600 hover:underline self-end"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-2">
          <Button type="submit" isLoading={isPending} className="w-full" size="lg">
            Log in
          </Button>
        </div>

        <p className="text-center text-sm font-body text-slate-500 mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-quest-600 font-600 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;