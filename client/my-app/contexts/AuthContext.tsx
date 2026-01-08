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

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.me();
        setUser(response.user);

        // Connect socket after auth
        if (response.user) {
          // Get access token from cookie (you might need to implement this)
          const accessToken = getAccessTokenFromCookie();
          if (accessToken) {
            socket.connect(accessToken);
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);

      // Connect socket
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        socket.connect(accessToken);
      }

      // Redirect based on role
      switch (response.user.role) {
        case "victim":
          router.push("/victim/dashboard");
          break;
        case "rescue":
          router.push("/rescue/dashboard");
          break;
        case "logistics":
          router.push("/logistics/dashboard");
          break;
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  // Signup
  const signup = async (data: SignupData) => {
    try {
      const response = await authApi.signup(data);
      setUser(response.user);

      // Connect socket
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        socket.connect(accessToken);
      }

      // Redirect based on role
      switch (response.user.role) {
        case "victim":
          router.push("/victim/dashboard");
          break;
        case "rescue":
          router.push("/rescue/dashboard");
          break;
        case "logistics":
          router.push("/logistics/dashboard");
          break;
      }
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      socket.disconnect();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.user);
    } catch (error) {
      setUser(null);
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Helper to get access token from cookie
function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}
