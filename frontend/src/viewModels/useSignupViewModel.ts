import { z } from "zod/v3";
import * as authApi from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupSchema } from "../schema/signupSchema";
import { extractServerError } from "./useLoginViewModel";

export interface SignupFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormState, string>>;

export interface SignupViewModel {
  form: SignupFormState;
  fieldErrors: SignupFormErrors;
  serverError: string | null;
  isSubmitting: boolean;

  handleFieldChange: (field: keyof SignupFormState, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function useSignupViewModel(): SignupViewModel {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<SignupFormErrors>({});

  const mutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      navigate("/login", {
        state: {
          registered: true,
        },
      });
    },
  });

  function handleFieldChange(field: keyof SignupFormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = signupSchema.safeParse(form);

    if (!result.success) {
      const errors: SignupFormErrors = {};

      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupFormErrors;

        if (!errors[field]) errors[field] = err.message;
      });

      setFieldErrors(errors);
      return;
    }

    const { confirmPassword: _discard, ...payload } = result.data;

    mutation.mutate(payload);
  }

  const serverError = mutation.isError
    ? extractServerError(mutation.error)
    : null;

  return {
    form,
    fieldErrors,
    serverError,
    isSubmitting: mutation.isPending,
    handleFieldChange,
    handleSubmit,
  };
}
