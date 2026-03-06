// Convenience hook so components don't have to import uiStore directly
// just to fire a toast.

import useUiStore from "@/store/uiStore";

const useToast = () => {
  const addToast = useUiStore((s) => s.addToast);

  return {
    success: (message) => addToast({ type: "success", message }),
    error: (message) => addToast({ type: "error", message }),
    info: (message) => addToast({ type: "info", message }),
    warning: (message) => addToast({ type: "warning", message }),
  };
};

export default useToast;