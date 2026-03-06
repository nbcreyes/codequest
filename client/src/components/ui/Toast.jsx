// Toast notification component driven by uiStore.

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import useUiStore from "@/store/uiStore";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <XCircle className="w-5 h-5 text-coral-500" />,
  warning: <AlertCircle className="w-5 h-5 text-gold-500" />,
  info:    <Info className="w-5 h-5 text-quest-500" />,
};

const backgrounds = {
  success: "bg-emerald-50 border-emerald-200",
  error:   "bg-coral-50 border-coral-200",
  warning: "bg-gold-50 border-gold-200",
  info:    "bg-quest-50 border-quest-200",
};

const ToastItem = ({ toast }) => {
  const removeToast = useUiStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={clsx(
        "flex items-start gap-3 p-4 rounded-2xl border-2 shadow-card",
        "min-w-72 max-w-sm font-body",
        backgrounds[toast.type] || backgrounds.info
      )}
    >
      {icons[toast.type] || icons.info}
      <p className="flex-1 text-sm text-slate-700 font-500">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Add clsx import at the top
import { clsx } from "clsx";

const ToastContainer = () => {
  const toasts = useUiStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;