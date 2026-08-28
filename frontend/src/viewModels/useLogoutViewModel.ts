import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth.api";

export interface LogoutViewModel {
  isLoggedOut: boolean;
  logout: () => void;
}

export function useLogoutViewModel(): LogoutViewModel {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      clearAuth();
      navigate("/", { replace: true });
    },
  });

  return {
    isLoggedOut: mutation.isPending,
    logout: () => mutation.mutate(),
  };
}
