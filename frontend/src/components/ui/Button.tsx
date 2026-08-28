import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  isLoading = false,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40";

  const sizes = {
    sm: "h-8 px-3.5 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
  };

  const variants = {
    primary:
      "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-hover active:bg-primary-active",
    secondary:
      "bg-secondary text-foreground border border-border hover:bg-secondary-hover",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-surface hover:border-border-hover",
    ghost:
      "bg-transparent text-muted hover:text-foreground hover:bg-surface",
    danger:
      "bg-danger-bg border border-danger/30 text-danger hover:bg-danger/10",
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={[base, sizes[size], variants[variant], className].join(" ")}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}
