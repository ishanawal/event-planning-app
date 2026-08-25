import axios from "axios";
import type { AppError } from "../types/auth.types";

export function extractServerError(err: unknown): string {
  if (axios.isAxiosError<AppError>(err)) {
    return (
      err.response?.data?.error?.message ??
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

export function extractValidationErrors(err: unknown): Record<string, string> {
  if (!axios.isAxiosError<AppError>(err)) {
    return {};
  }

  const details = err.response?.data?.error?.details;

  if (!details) {
    return {};
  }

  return details.reduce<Record<string, string>>((errors, detail) => {
    errors[detail.field] = detail.message;
    return errors;
  }, {});
}
