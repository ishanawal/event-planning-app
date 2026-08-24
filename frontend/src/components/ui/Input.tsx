import type React from "react";
import { forwardRef, type ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, icon, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-[#E8E8D0]">
          {label}
        </label>

        <div className="relative">
          {icon && (
            <span
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#737B6E]
                transition-colors
                peer-focus:text-[#BFD77A]
              "
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
            className={[
              "peer w-full rounded-xl border",
              "px-4 py-3 text-sm",
              icon ? "pl-11" : "",
              "bg-[#101610]",
              "text-[#F3F0D7]",
              "border-[#2D3A2B]",
              "placeholder:text-[#687064]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
              "transition-all duration-200",
              "hover:border-[#43523F]",
              "focus:border-[#BFD77A]",
              "focus:outline-none",
              "focus:ring-2",
              "focus:ring-[#BFD77A]/20",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",

              error
                ? [
                    "border-red-500/70",
                    "bg-red-950/20",
                    "focus:border-red-400",
                    "focus:ring-red-400/20",
                  ].join(" ")
                : "",

              props.className ?? "",
            ].join(" ")}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
