// Reusable input component with label, error, and helper text.

import { clsx } from "clsx";
import { forwardRef } from "react";

const Input = forwardRef(({
  label,
  error,
  helperText,
  id,
  className = "",
  type = "text",
  required = false,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-body font-600 text-sm text-slate-700"
        >
          {label}
          {required && <span className="text-coral-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        type={type}
        className={clsx(
          "w-full px-4 py-3 rounded-xl border-2 font-body text-slate-800",
          "transition-all duration-200 outline-none bg-white",
          "placeholder:text-slate-400",
          error
            ? "border-coral-400 focus:border-coral-500 focus:ring-2 focus:ring-coral-100"
            : "border-slate-200 focus:border-quest-400 focus:ring-2 focus:ring-quest-100",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-coral-500 text-sm font-body font-500">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-slate-400 text-sm font-body">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;