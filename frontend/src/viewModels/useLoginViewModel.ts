import axios from "axios";
import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as authApi from "../api/auth.api";
import { loginSchema } from "../schema/loginSchema";

export interface LoginFormState {
  email: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>;

export interface LoginViewModel {
  form: LoginFormState;
  fieldErrors: LoginFormErrors;
  serverError: string | null;
  isSubmitting: boolean;
  justRegistered: boolean;

  handleFieldChange: (field: keyof LoginFormState, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function useLoginViewModel(): LoginViewModel {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});

  const justRegistered =
    (location.state as { registered?: boolean } | null)?.registered ?? false;

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setUser(user);
      navigate("/events", { replace: true });
    },
  });

  function handleFieldChange(field: keyof LoginFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));

    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const errors: LoginFormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormErrors;

        if (!errors[field]) errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    mutation.mutate(result.data);
  }

  const serverError = mutation.isError
    ? extractServerError(mutation.error)
    : null;

  return {
    form,
    fieldErrors,
    serverError,
    isSubmitting: mutation.isPending,
    justRegistered,
    handleFieldChange,
    handleSubmit,
  };
}

export function extractServerError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data.error?.message ??
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}
