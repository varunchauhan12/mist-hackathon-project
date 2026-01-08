"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLiveLocation } from "@/hooks/useLiveLocation";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // ✅ Start live location ONLY after auth is resolved
  useLiveLocation(!loading && user ? user.role : null);

  return <>{children}</>;
}
