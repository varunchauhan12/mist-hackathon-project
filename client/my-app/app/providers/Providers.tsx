"use client";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { SocketProvider } from "@/contexts/SocketContext";
import LocationProvider from "@/app/providers/LocationProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        <LocationProvider>
          {children}
        </LocationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
