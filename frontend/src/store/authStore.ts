import { create } from "zustand";

import type { User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setHydrated: () =>
    set({
      isHydrated: true,
    }),
}));
