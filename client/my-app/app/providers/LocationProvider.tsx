"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { socket } from "@/lib/socket";
import { useLiveLocation } from "@/hooks/useLiveLocation";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  useLiveLocation(!loading && user ? user.role : null);

  useEffect(() => {
    if (!loading && user) {
      socket.connect(); // ✅ cookie auth
    } else {
      socket.disconnect();
    }
  }, [loading, user]);

  return <>{children}</>;
}
