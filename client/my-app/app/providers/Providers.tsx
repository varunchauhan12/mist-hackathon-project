"use client";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { SocketProvider } from "@/contexts/SocketContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>{children}</SocketProvider>
    </AuthProvider>
  );
}
