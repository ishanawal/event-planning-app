import { CalendarDays, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

interface NavbarProps {
  variant?: "marketing" | "app";
}

export default function Navbar({ variant = "marketing" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const marketingNavItems = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Categories", href: "#categories" },
  ];

  const appNavItems = [
    { label: "Overview", to: "/dashboard" },
    { label: "My Events", to: "/events/mine" },
    { label: "Discover", to: "/events" },
  ];

  return (
    <header
      className="
        relative z-50
        border-b border-border
        bg-background/90
        backdrop-blur-xl
        py-3
      "
    >
      <div
        className="
          mx-auto
          flex
          h-10
          max-w-7xl
          items-center
          justify-between
          px-6
          lg:px-8
        "
      >
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-primary/20
              bg-primary/10
              text-primary
            "
          >
            <CalendarDays size={21} strokeWidth={1.7} />
          </div>

          <span
            className="
              font-serif
              text-xl
              font-semibold
              tracking-tight
              text-cream
            "
          >
            Event Planner
          </span>
        </Link>

        {/* Desktop Navigation */}

        {variant === "marketing" ? (
          <nav className="hidden items-center gap-8 md:flex">
            {marketingNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="
          text-sm
          text-muted
          transition-colors
          hover:text-cream
        "
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="hidden items-center gap-2 md:flex">
            {appNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-card-hover hover:text-cream",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right action buttons */}

        <div className="hidden items-center gap-3 md:flex">
          {variant === "marketing" ? (
            <>
              <Link
                to="/login"
                className="
                  px-3 py-2
                  text-sm
                  font-medium
                  text-muted
                  transition
                  hover:text-cream
                "
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="
                  rounded-xl
                  bg-primary
                  px-4 py-2.5
                  text-sm
                  font-semibold
                  text-[#10130B]
                  transition
                  hover:bg-primary-hover
                "
              >
                Get started
              </Link>
            </>
          ) : (
            <Link
              to="/events/create"
              className="
                rounded-xl
                bg-primary
                px-4 py-2.5
                text-sm
                font-semibold
                text-[#10130B]
                transition
                hover:bg-primary-hover
              "
            >
              Create event
            </Link>
          )}
        </div>

        {/* Mobile button */}

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((value) => !value)}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-border
            bg-card
            text-muted
            transition
            hover:text-cream
            md:hidden
          "
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation items*/}

      {mobileOpen && (
        <div
          className="
            border-t border-border
            bg-background
            px-6
            py-5
            md:hidden
          "
        >
          <nav className="flex flex-col gap-1">
            {variant === "marketing"
              ? marketingNavItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="
            rounded-xl
            px-4 py-3
            text-sm
            text-muted
            transition
            hover:bg-card
            hover:text-cream
          "
                  >
                    {item.label}
                  </a>
                ))
              : appNavItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "rounded-xl px-4 py-3 text-sm transition",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted hover:bg-card hover:text-cream",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            {variant === "marketing" ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex-1
                    rounded-xl
                    border border-border
                    px-4 py-3
                    text-center
                    text-sm
                    font-medium
                    text-cream
                  "
                >
                  Sign in
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex-1
                    rounded-xl
                    bg-primary
                    px-4 py-3
                    text-center
                    text-sm
                    font-semibold
                    text-[#10130B]
                  "
                >
                  Get started
                </Link>
              </div>
            ) : (
              <Link
                to="/events/create"
                onClick={() => setMobileOpen(false)}
                className="
                  block
                  rounded-xl
                  bg-primary
                  px-4 py-3
                  text-center
                  text-sm
                  font-semibold
                  text-[#10130B]
                "
              >
                Create event
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
