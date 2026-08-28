import type React from "react";
import { forwardRef, type ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, icon, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground-secondary">
          {label}
        </label>

        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
            className={[
              "w-full rounded-xl border bg-input px-3.5 py-2.5 text-sm text-foreground",
              "placeholder:text-placeholder",
              "transition-colors duration-150",
              icon ? "pl-10" : "",
              "focus:outline-none focus:ring-2",
              error
                ? "border-danger/50 focus:border-danger focus:ring-danger/15"
                : "border-border hover:border-border-hover focus:border-primary/50 focus:ring-primary/10",
              "disabled:cursor-not-allowed disabled:opacity-40",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-placeholder">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
