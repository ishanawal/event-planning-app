import { Menu, X, Plus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLogoutViewModel } from "../../viewModels/useLogoutViewModel";

interface NavbarProps {
  variant?: "marketing" | "app";
}

function BrandIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="4"
        width="16"
        height="14"
        rx="3"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="2"
        y="4"
        width="16"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 2v3M13 2v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Navbar({ variant = "marketing" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useLogoutViewModel();

  const marketingLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Categories", href: "#categories" },
  ];

  const appLinks = [
    { label: "Overview", to: "/dashboard", end: false },
    { label: "My events", to: "/events/mine", end: false },
    { label: "Discover", to: "/events", end: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={variant === "app" ? "/dashboard" : "/"}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
            <BrandIcon size={16} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Gathered
          </span>
        </Link>

        {/* Desktop nav */}
        {variant === "marketing" ? (
          <nav className="hidden items-center gap-6 md:flex">
            {marketingLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="hidden items-center gap-0.5 md:flex">
            {appLinks.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-3.5 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/8 font-medium text-primary"
                      : "text-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {variant === "marketing" || !isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/events/create"
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <Plus size={15} />
                New event
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {user?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <span className="hidden text-sm font-medium text-foreground-secondary xl:block">
                  {user?.name?.split(" ")[0]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Sign out
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:bg-surface md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {variant === "marketing"
              ? marketingLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3.5 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))
              : appLinks.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/8 font-medium text-primary"
                          : "text-muted hover:bg-surface hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
          </nav>

          <div className="mt-3 border-t border-border pt-3">
            {variant === "marketing" ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-medium text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/events/create"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus size={15} />
                  New event
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted hover:text-foreground"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
