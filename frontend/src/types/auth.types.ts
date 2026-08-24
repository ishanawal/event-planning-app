export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface AppError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}
