"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/app/providers/AuthProvider";
import { Location, RescueMessage, SocketNotification } from "@/types";

interface SocketContextType {
  connected: boolean;

  notifications: SocketNotification[];
  clearNotifications: () => void;

  victimLocations: Map<string, Location>;
  rescueLocations: Map<string, Location>;

  rescueMessages: RescueMessage[];
  sendRescueMessage: (message: string) => void;
  joinRescueChat: (lat: number, lng: number) => void;

  route: any;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<SocketNotification[]>([]);
  const [victimLocations, setVictimLocations] = useState<Map<string, Location>>(
    new Map()
  );
  const [rescueLocations, setRescueLocations] = useState<Map<string, Location>>(
    new Map()
  );
  const [rescueMessages, setRescueMessages] = useState<RescueMessage[]>([]);
  const [route, setRoute] = useState<any>(null);

  /* ================= SOCKET LIFECYCLE ================= */

  useEffect(() => {
    if (loading || !user) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    });

    /* ================= NOTIFICATIONS ================= */

    socket.on("notification:new", (data: SocketNotification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    /* ================= LOCATIONS ================= */

    if (user.role === "rescue" || user.role === "logistics") {
      socket.on(
        "victimLocation",
        ({ userId, lat, lng }: { userId: string; lat: number; lng: number }) => {
          setVictimLocations((prev) => {
            const updated = new Map(prev);
            updated.set(userId, { lat, lng });
            return updated;
          });
        }
      );
    }

    if (user.role === "logistics") {
      socket.on(
        "rescueLocation",
        ({ userId, lat, lng }: { userId: string; lat: number; lng: number }) => {
          setRescueLocations((prev) => {
            const updated = new Map(prev);
            updated.set(userId, { lat, lng });
            return updated;
          });
        }
      );
    }

    /* ================= RESCUE CHAT ================= */

    if (user.role === "rescue") {
      socket.on("rescue:new-message", (msg: RescueMessage) => {
        setRescueMessages((prev) => [...prev, msg]);
      });

      socket.on("rescue:joined-room", () => {
        setRescueMessages([]); // reset chat on room change
      });
    }

    /* ================= ROUTE ================= */

    socket.on("route:update", (newRoute: any) => {
      setRoute(newRoute);
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [user, loading]);

  /* ================= ACTIONS ================= */

  const sendRescueMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("rescue:send-message", { message });
  };

  const joinRescueChat = (lat: number, lng: number) => {
    socket.emit("rescue:join-nearby", { lat, lng });
  };

  const clearNotifications = () => setNotifications([]);

  const value: SocketContextType = {
    connected,
    notifications,
    clearNotifications,
    victimLocations,
    rescueLocations,
    rescueMessages,
    sendRescueMessage,
    joinRescueChat,
    route,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};
