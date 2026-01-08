"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import authApi from "@/lib/api/authApi";
import { socket } from "@/lib/socket";
import { User, LoginCredentials, SignupData } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔐 Restore session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.me();
        setUser(res.user);

        // ✅ Connect socket AFTER auth is confirmed
        socket.connect();
      } catch {
        setUser(null);
        socket.disconnect();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials) => {
    const res = await authApi.login(credentials);
    setUser(res.user);

    // ✅ Cookies are already set by backend
    socket.connect();

    switch (res.user.role) {
      case "victim":
        router.replace("/victim/dashboard");
        break;
      case "rescue":
        router.replace("/rescue/dashboard");
        break;
      case "logistics":
        router.replace("/logistics/dashboard");
        break;
    }
  };

  // Signup
  const signup = async (data: SignupData) => {
    const res = await authApi.signup(data);
    setUser(res.user);

    socket.connect();

    switch (res.user.role) {
      case "victim":
        router.replace("/victim/dashboard");
        break;
      case "rescue":
        router.replace("/rescue/dashboard");
        break;
      case "logistics":
        router.replace("/logistics/dashboard");
        break;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      socket.disconnect();
      router.replace("/auth/login");
    }
  };

  // Silent refresh
  const refreshUser = async () => {
    try {
      const res = await authApi.me();
      setUser(res.user);
    } catch {
      setUser(null);
      socket.disconnect();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
