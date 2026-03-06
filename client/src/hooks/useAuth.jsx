// Convenience hook that exposes auth state and actions
// with a clean API for components to consume.

import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import { logoutParent, getMe } from "@/services/authService";
import { switchToChild } from "@/services/childService";
import useToast from "./useToast";

const useAuth = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    parent,
    parentToken,
    currentChild,
    childToken,
    setParentAuth,
    setChildSession,
    clearAuth,
    clearChildSession,
    updateParent,
  } = useAuthStore();

  // Keep parent data fresh on mount
  const { refetch: refetchMe } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!parentToken,
    onSuccess: (data) => updateParent(data.data.parent),
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutParent,
    onSettled: () => {
      clearAuth();
      navigate("/login", { replace: true });
    },
  });

  const { mutate: switchChild, isPending: isSwitching } = useMutation({
    mutationFn: ({ childId, pin }) => switchToChild(childId, pin),
    onSuccess: (data) => {
      setChildSession(data.data.childToken, data.data.child);
      navigate("/play", { replace: true });
    },
    onError: (error) => {
      const code = error.response?.data?.code;
      if (code === "PIN_REQUIRED" || code === "PIN_INCORRECT") {
        return error; // Let the calling component handle PIN errors
      }
      toast.error(error.response?.data?.message || "Could not switch profiles.");
    },
  });

  return {
    parent,
    parentToken,
    currentChild,
    childToken,
    isAuthenticated: !!parentToken,
    hasChildSession: !!childToken,
    logout,
    isLoggingOut,
    switchChild,
    isSwitching,
    refetchMe,
  };
};

export default useAuth;