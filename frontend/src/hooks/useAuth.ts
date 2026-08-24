import axios from "axios";
import * as authApi from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useMutation } from "@tanstack/react-query";
import type { LoginPayload, SignupPayload } from "../types/auth.types";

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.error.message ??
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user) => {
      setUser(user);
      navigate("/events", { replace: true });
    },
  });
}

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: () => {
      navigate("/login", {
        state: {
          registered: true,
        },
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      navigate("/login", { replace: true });
    },
  });
}

export { getErrorMessage };
