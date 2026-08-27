import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useMutation } from "@tanstack/react-query";
import * as authApi from "../api/auth.api";
export interface LogoutViewModel {
  isLoggedOut: boolean;
  logout: () => void;
}

export function useLogoutViewModel(): LogoutViewModel {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      navigate("/", { replace: true });
    },
  });

  return {
    isLoggedOut: mutation.isPending,
    logout: () => mutation.mutate(),
  };
}
