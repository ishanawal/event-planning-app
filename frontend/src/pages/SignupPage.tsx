import type React from "react";

import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  LockKeyhole,
  Mail,
  User,
  Users,
} from "lucide-react";

import { useSignupViewModel } from "../viewModels/useSignupViewModel";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function SignupPage() {
  const viewModel = useSignupViewModel();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -right-48
            -top-48
            h-150
            w-150
            rounded-full
            bg-primary/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-48
            -left-48
            h-150
            w-150
            rounded-full
            bg-secondary/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-[18%]
            top-[25%]
            h-2
            w-2
            rounded-full
            bg-primary/30
          "
        />

        <div
          className="
            absolute
            right-[15%]
            top-[30%]
            h-1.5
            w-1.5
            rounded-full
            bg-secondary/30
          "
        />
      </div>

      {/* Navbar section */}

      <header className="relative z-20">
        <div
          className="
            mx-auto
            flex
            h-18
            max-w-7xl
            items-center
            justify-between
            px-6
            lg:px-8
          "
        >
          <Link to="/" className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-primary/20
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

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:block">
              Already have an account?
            </span>

            <Link
              to="/login"
              className="
                rounded-xl
                border
                border-border
                bg-card
                px-4
                py-2.5
                text-sm
                font-medium
                text-cream
                transition
                hover:border-primary/30
                hover:bg-card-hover
              "
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section*/}

      <main
        className="
          relative
          z-10
          flex
          min-h-[calc(100vh-72px)]
          items-center
          px-6
          py-12
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-6xl
            items-center
            gap-16
            lg:grid-cols-[1fr_460px]
            lg:gap-20
          "
        >
          {/* Left Section */}

          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-8 flex items-center gap-3">
                <div
                  className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-primary/15
                      bg-primary/10
                      text-primary
                    "
                >
                  <CalendarDays size={23} strokeWidth={1.6} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    Event Planner
                  </p>

                  <p className="mt-0.5 text-xs text-muted">
                    Plan something memorable
                  </p>
                </div>
              </div>

              <p
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-primary
                "
              >
                Start planning
              </p>

              <h1
                className="
                  mt-3
                  font-serif
                  text-5xl
                  font-semibold
                  leading-[1.04]
                  tracking-tight
                  text-cream
                  xl:text-6xl
                "
              >
                Plan something
                <br />
                <span className="text-primary">worth remembering.</span>
              </h1>

              <p
                className="
                  mt-7
                  max-w-md
                  text-base
                  leading-7
                  text-muted
                "
              >
                Create events, invite people, and keep everything organized in
                one place.
              </p>
            </div>

            <div className="mt-14 space-y-5">
              <Feature
                icon={<CalendarDays size={18} strokeWidth={1.7} />}
                title="Create and manage events"
                description="Keep your plans organized."
              />

              <Feature
                icon={<Users size={18} strokeWidth={1.7} />}
                title="Bring people together"
                description="Share events with your community."
              />

              <Feature
                icon={<CheckCircle2 size={18} strokeWidth={1.7} />}
                title="Stay organized"
                description="Keep dates, locations, and details easy to find."
              />
            </div>
          </section>

          {/* Signup card section */}

          <section>
            <div
              className="
                w-full
                rounded-2xl
                border
                border-border
                bg-card
                p-7
                shadow-2xl
                shadow-black/20
                sm:p-9
              "
            >
              <div className="mb-8">
                <div
                  className="
                    mb-5
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <User size={21} strokeWidth={1.7} />
                </div>

                <h2
                  className="
                    font-serif
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-cream
                  "
                >
                  Create account
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-muted
                  "
                >
                  Create your account and start planning something memorable.
                </p>
              </div>

              {viewModel.serverError && (
                <div
                  role="alert"
                  className="
                    mb-6
                    rounded-xl
                    border
                    border-danger/20
                    bg-danger-bg
                    px-4
                    py-3
                    text-sm
                    text-danger
                  "
                >
                  {viewModel.serverError}
                </div>
              )}

              <form
                onSubmit={viewModel.handleSubmit}
                noValidate
                className="space-y-5"
              >
                <Input
                  label="Full name"
                  name="name"
                  type="text"
                  icon={<User size={18} strokeWidth={1.8} />}
                  autoComplete="name"
                  value={viewModel.form.name}
                  onChange={(e) =>
                    viewModel.handleFieldChange("name", e.target.value)
                  }
                  error={viewModel.fieldErrors.name}
                  placeholder="Alice Smith"
                />

                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  icon={<Mail size={18} strokeWidth={1.8} />}
                  autoComplete="email"
                  value={viewModel.form.email}
                  onChange={(e) =>
                    viewModel.handleFieldChange("email", e.target.value)
                  }
                  error={viewModel.fieldErrors.email}
                  placeholder="you@example.com"
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  icon={<LockKeyhole size={18} strokeWidth={1.8} />}
                  autoComplete="new-password"
                  value={viewModel.form.password}
                  onChange={(e) =>
                    viewModel.handleFieldChange("password", e.target.value)
                  }
                  error={viewModel.fieldErrors.password}
                  placeholder="Create a strong password"
                />

                <Input
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  icon={<LockKeyhole size={18} strokeWidth={1.8} />}
                  autoComplete="new-password"
                  value={viewModel.form.confirmPassword}
                  onChange={(e) =>
                    viewModel.handleFieldChange(
                      "confirmPassword",
                      e.target.value,
                    )
                  }
                  error={viewModel.fieldErrors.confirmPassword}
                  placeholder="Repeat your password"
                />

                <div
                  className="
                    flex
                    items-start
                    gap-2
                    pt-0.5
                    text-xs
                    leading-5
                    text-muted
                  "
                >
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="
                      mt-0.5
                      shrink-0
                      text-primary
                    "
                  />

                  <span>
                    Use at least 8 characters, including an uppercase letter and
                    a number.
                  </span>
                </div>

                <Button
                  type="submit"
                  isLoading={viewModel.isSubmitting}
                  className="
                    group
                    w-full
                    rounded-xl!
                    bg-primary!
                    py-3.5!
                    text-[#10130B]!
                    shadow-lg
                    shadow-primary/10
                    transition-all
                    hover:bg-primary-hover!
                    hover:shadow-primary/20
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    Create account
                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </span>
                </Button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />

                <span
                  className="
                    text-[10px]
                    font-medium
                    tracking-wider
                    text-placeholder
                  "
                >
                  OR
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <p
                className="
                  mt-7
                  text-center
                  text-sm
                  text-muted
                "
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                    font-medium
                    text-primary
                    transition
                    hover:text-primary-hover
                  "
                >
                  Sign in
                </Link>
              </p>
              <p
                className="
                  mx-auto
                  mt-5
                  max-w-sm
                  text-center
                  text-[11px]
                  leading-5
                  text-placeholder
                "
              >
                By creating an account, you agree to our terms of service and
                privacy policy.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Feature component
function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-primary/10
          bg-primary/10
          text-primary
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-cream">{title}</p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
