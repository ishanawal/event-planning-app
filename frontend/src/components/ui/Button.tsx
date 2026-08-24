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
  const base = `
  group
  box-border
  inline-flex
  items-center
  justify-center
  gap-2
  rounded-xl
  font-medium
  transition-all
  duration-200
  ease-out

  focus:outline-none
  focus:ring-2
  focus:ring-primary/40
  focus:ring-offset-2
  focus:ring-offset-background

  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:hover:translate-y-0
  disabled:hover:shadow-none
`;

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-sm",
  };

  const variants = {
    primary: `
    bg-primary
    text-[#10130B]
    shadow-sm

    hover:-translate-y-0.5
    hover:bg-primary-hover
    hover:shadow-lg
    hover:shadow-primary/15

    active:translate-y-0
    active:scale-[0.98]
  `,

    secondary: `
    bg-secondary
    text-foreground
    shadow-sm

    hover:-translate-y-0.5
    hover:bg-secondary-hover
    hover:shadow-md

    active:translate-y-0
    active:scale-[0.98]
  `,
    outline: `
  border
  border-border
  bg-transparent
  text-foreground

  hover:-translate-y-0.5
  hover:border-border-hover
  hover:bg-card
  hover:shadow-md

  active:translate-y-0
  active:scale-[0.98]
`,
    ghost: `
    bg-transparent
    text-muted

    hover:bg-card
    hover:text-cream

    active:scale-[0.98]
  `,

    danger: `
    bg-danger
    text-white
    shadow-sm

    hover:-translate-y-0.5
    hover:bg-danger/90
    hover:shadow-lg
    hover:shadow-danger/15

    active:translate-y-0
    active:scale-[0.98]
  `,
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
        leftIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
            {leftIcon}
          </span>
        )
      )}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span
          className="
            shrink-0
            transition-transform
            duration-200
            group-hover:translate-x-1
          "
        >
          {rightIcon}
        </span>
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
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
