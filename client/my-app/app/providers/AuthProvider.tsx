"use client";

import { createContext, useContext, useEffect, useState } from "react";
import authApi from "@/app/(api)/authApi/page";
import { socket } from "@/lib/socket";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "victim" | "rescue" | "logistics";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch logged-in user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await authApi.get("/me");
        setUser(res.data.user);

        // connect socket AFTER auth
        socket.auth = { token: res.data.accessToken }; // optional if JWT in cookie
        socket.connect();
      } catch {
        setUser(null);
        socket.disconnect();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const logout = async () => {
    await authApi.post("/logout");
    socket.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
