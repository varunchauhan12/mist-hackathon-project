"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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
    new Map(),
  );
  const [rescueLocations, setRescueLocations] = useState<Map<string, Location>>(
    new Map(),
  );
  const [rescueMessages, setRescueMessages] = useState<RescueMessage[]>([]);
  const [route, setRoute] = useState<any>(null);

  /* ================= SOCKET LISTENERS ================= */

  useEffect(() => {
    if (loading || !user) return;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("notification:new", (data: SocketNotification) => {
      console.log("🔔 notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    if (user.role === "rescue" || user.role === "logistics") {
      socket.on("victimLocation", ({ userId, lat, lng }) => {
        setVictimLocations((prev) => {
          const map = new Map(prev);
          map.set(userId, { lat, lng });
          return map;
        });
      });
    }

    if (user.role === "logistics") {
      socket.on("rescueLocation", ({ userId, lat, lng }) => {
        setRescueLocations((prev) => {
          const map = new Map(prev);
          map.set(userId, { lat, lng });
          return map;
        });
      });
    }

    if (user.role === "rescue") {
      socket.on("rescue:new-message", (msg: RescueMessage) => {
        setRescueMessages((prev) => [...prev, msg]);
      });

      socket.on("rescue:joined-room", () => {
        setRescueMessages([]);
      });
    }

    socket.on("route:update", (newRoute: any) => {
      setRoute(newRoute);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("notification:new");
      socket.off("victimLocation");
      socket.off("rescueLocation");
      socket.off("rescue:new-message");
      socket.off("rescue:joined-room");
      socket.off("route:update");
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

  return (
    <SocketContext.Provider
      value={{
        connected,
        notifications,
        clearNotifications,
        victimLocations,
        rescueLocations,
        rescueMessages,
        sendRescueMessage,
        joinRescueChat,
        route,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};
