import { Navigate, Outlet, useLocation } from "react-router-dom";

import { CalendarDays } from "lucide-react";

import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const location = useLocation();

  // Blocking render of page until the refresh token is validated
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays size={20} strokeWidth={1.7} />
          </div>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
