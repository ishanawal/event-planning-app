import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useLoginViewModel } from "../viewModels/useLoginViewModel";

function BrandIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="4"
        width="16"
        height="14"
        rx="3"
        fill="currentColor"
        opacity="0.2"
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

export default function LoginPage() {
  const vm = useLoginViewModel();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div
        className="relative hidden w-[42%] shrink-0 flex-col justify-between bg-primary bg-cover bg-center bg-no-repeat p-10 lg:flex xl:p-14"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/8581041/pexels-photo-8581041.jpeg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-cream/60" />
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <BrandIcon />
            </div>
            <span className="text-[15px] font-semibold"> Gathered </span>
          </Link>
          <div>
            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-xs text-base leading-7 text-white/70">
              Your events are waiting. Pick up where you left off.
            </p>
          </div>
          <p className="text-sm text-white/50">
            No account?
            <Link
              to="/signup"
              className="text-white/80 underline-offset-2 hover:underline"
            >
              {" "}
              Create one
            </Link>
          </p>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <BrandIcon />
            </div>
            Gathered
          </Link>
          <Link
            to="/signup"
            className="text-sm text-muted hover:text-foreground"
          >
            Sign up
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-5 py-12">
          <div className="w-full max-w-90">
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="mt-1.5 text-sm text-muted">
              Enter your email and password to continue.
            </p>

            {vm.justRegistered && (
              <div className="mt-5 rounded-xl border border-success/25 bg-success-bg px-4 py-3 text-sm text-success">
                Account created — you can sign in now.
              </div>
            )}

            {vm.serverError && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger"
              >
                {vm.serverError}
              </div>
            )}

            <form
              onSubmit={vm.handleSubmit}
              noValidate
              className="mt-7 space-y-4"
            >
              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                value={vm.form.email}
                onChange={(e) => vm.handleFieldChange("email", e.target.value)}
                error={vm.fieldErrors.email}
              />

              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  icon={<LockKeyhole size={16} />}
                  value={vm.form.password}
                  onChange={(e) =>
                    vm.handleFieldChange("password", e.target.value)
                  }
                  error={vm.fieldErrors.password}
                />
                <div className="mt-2 flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={vm.isSubmitting}
                size="lg"
                className="mt-1 w-full"
                rightIcon={<ArrowRight size={16} />}
              >
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              No account?
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary-hover"
              >
                {" "}
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
