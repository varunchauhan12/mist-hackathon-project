"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLiveLocation } from "@/hooks/useLiveLocation";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // don’t start before auth resolves
  if (loading) return <>{children}</>;

  // START TRACKING ONCE
  if (user) {
    useLiveLocation(user.role);
  }

  return <>{children}</>;
}
