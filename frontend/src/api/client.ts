import axios from "axios";

// Storing access token in module memory to make it XSS safe
let _accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  _accessToken = token;
};

export const getAccessToken = () => _accessToken;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
  withCredentials: true,
});

// Attaching access token to every outgoing requests
apiClient.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// Refreshing when 401 status is returned
let isRefreshing = false;
type QueryEntry = {
  resolve: (v: string) => void;
  reject: (e: unknown) => void;
};

let failedQueue: QueryEntry[] = [];

function flushQueue(error: unknown, token: string | null) {
  failedQueue.forEach((entry) =>
    error ? entry.reject(error) : entry.resolve(token as string),
  );
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    const authEndpoints = [
      "/auth/login",
      "/auth/signup",
      "/auth/refresh",
      "/auth/logout",
    ];

    if (
      error.response?.status !== 401 ||
      original._retry ||
      authEndpoints.includes(original.url ?? "")
    ) {
      return Promise.reject(error);
    }

    // Queuing requests while refreshing is taking place
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post<{
        success: true;
        data: {
          accessToken: string;
        };
      }>("/auth/refresh");

      const newToken = data.data.accessToken;
      setAccessToken(newToken);
      flushQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;

      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      setAccessToken(null);

      // Redirecting to login when token is expired
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
