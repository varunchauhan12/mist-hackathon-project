import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",

  // Emergency
  REPORT_EMERGENCY: "/emergency",
  MY_EMERGENCIES: "/emergency/my",
  ALL_EMERGENCIES: "/emergency",
  UPDATE_EMERGENCY_STATUS: (id: string) => `/emergency/${id}/status`,

  // Safe Zones (you might need to add these routes in backend)
  SAFE_ZONES: "/safe-zones",
  NEARBY_SAFE_ZONES: "/safe-zones/nearby",

  // Notifications (add to backend)
  NOTIFICATIONS: "/notifications",
  MARK_READ: (id: string) => `/notifications/${id}/read`,

  // Resources (add to backend)
  ALLOCATE_RESOURCE: "/resources/allocate",
  MY_ALLOCATIONS: "/resources/my-allocations",
  ALL_ALLOCATIONS: "/resources/allocations",
};