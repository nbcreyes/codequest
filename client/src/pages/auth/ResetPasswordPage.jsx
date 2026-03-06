import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { resetPassword } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const setParentAuth = useAuthStore((s) => s.setParentAuth);
  const addToast = useUiStore((s) => s.addToast);

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: () => resetPassword(token, form.password, form.confirmPassword),
    onSuccess: (data) => {
      setParentAuth(data.data.token, null);
      addToast({ type: "success", message: "Password reset successfully." });
      navigate("/parent/dashboard", { replace: true });
    },
    onError: (error) => {
      const data = error.response?.data;
      if (data?.errors) {
        const fieldErrors = {};
        data.errors.forEach((e) => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        addToast({
          type: "error",
          message: data?.message || "Reset failed. The link may have expired.",
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
    mutate();
  };

  return (
    <AuthLayout title="Choose a new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="New password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          helperText="At least 8 characters, one uppercase letter, one number"
          required
          autoComplete="new-password"
          autoFocus
        />

        <Input
          label="Confirm new password"
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
            Reset password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;