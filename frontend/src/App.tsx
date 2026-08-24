import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAuthStore } from "./store/authStore";
import { refreshSession } from "./api/auth.api";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import ProtectedRoute from "./components/layout/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setHydrated } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    refreshSession()
      .then((user) => {
        if (mounted && user) {
          setUser(user);
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
  }, [setUser, setHydrated]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            {/* Public routes */}

            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>
              <Route
                path="/events"
                element={
                  <div className="p-8 text-center text-gray-500">
                    Hello this is events page
                  </div>
                }
              />
            </Route>

            {/* Fallback */}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
