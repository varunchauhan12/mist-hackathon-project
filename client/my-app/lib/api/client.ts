import axios, { AxiosInstance, AxiosError } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ REQUIRED for cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Response interceptor (refresh only, no redirects)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return apiClient(originalRequest);
      } catch {
        // ❌ NEVER redirect from here
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
