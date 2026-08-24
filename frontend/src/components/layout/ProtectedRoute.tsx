import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Routing based on global auth state
export default function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  const location = useLocation();

  // Blocking render until the refresh-token check completes
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
