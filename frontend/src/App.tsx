import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "./store/authStore";
import { refreshSession } from "./api/auth.api";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import EditEventPage from "./pages/EditEventPage";
import MyEventsPage from "./pages/MyEventsPage";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicRoute from "./components/layout/PublicRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
});

function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    refreshSession()
      .then((user) => {
        if (!mounted) return;

        if (user) {
          setUser(user);
        } else {
          clearAuth();
        }
      })
      .catch(() => {
        if (mounted) {
          clearAuth();
        }
      })
      .finally(() => {
        if (mounted) {
          setHydrated();
        }
      });

    return () => {
      mounted = false;
    };
  }, [setUser, clearAuth, setHydrated]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            {/* Public landing */}

            {/* Auth & Public — unauthenticated only */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected — requires login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/events/mine" element={<MyEventsPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/events/:id/edit" element={<EditEventPage />} />
            </Route>

            {/* Semi-public which is visible to all, but RSVP requires auth */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
