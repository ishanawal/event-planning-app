import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  User,
  ApiSuccess,
} from "../types/auth.types";
import apiClient, { setAccessToken } from "./client";

export async function signup(payload: SignupPayload): Promise<User> {
  const { data } = await apiClient.post<ApiSuccess<{ user: User }>>(
    "/auth/signup",
    payload,
  );
  return data.data.user;
}

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await apiClient.post<ApiSuccess<LoginResponse>>(
    "/auth/login",
    payload,
  );

  setAccessToken(data.data.accessToken);
  return data.data.user;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}
export async function refreshSession(): Promise<User | null> {
  try {
    const { data: refreshData } =
      await apiClient.post<ApiSuccess<{ accessToken: string }>>(
        "/auth/refresh",
      );

    setAccessToken(refreshData.data.accessToken);

    const payload = JSON.parse(
      atob(refreshData.data.accessToken.split(".")[1]),
    ) as {
      userId: number;
      email: string;
      name?: string;
    };

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name ?? "",
      created_at: "",
      updated_at: "",
    };
  } catch {
    return null;
  }
}
