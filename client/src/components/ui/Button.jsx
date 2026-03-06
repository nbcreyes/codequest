// Reusable button component with variants and loading state.

import { motion } from "framer-motion";
import { clsx } from "clsx";

const variants = {
  primary:   "bg-quest-600 hover:bg-quest-700 text-white shadow-quest-sm hover:shadow-quest-md",
  secondary: "bg-white hover:bg-quest-50 text-quest-600 border-2 border-quest-200 hover:border-quest-400",
  danger:    "bg-coral-500 hover:bg-coral-600 text-white",
  ghost:     "bg-transparent hover:bg-quest-50 text-quest-600",
  gold:      "bg-gold-400 hover:bg-gold-500 text-white shadow-md",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={clsx(
        "font-body font-700 rounded-2xl transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Loading...
        </span>
      ) : children}
    </motion.button>
  );
};

export default Button;