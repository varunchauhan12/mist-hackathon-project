"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/app/providers/AuthProvider"; // ✅ FIXED: Correct import path
import { SocketNotification, RescueMessage, Location } from "@/types";

interface SocketContextType {
  connected: boolean;
  notifications: SocketNotification[];
  victimLocations: Map<string, Location>;
  rescueLocations: Map<string, Location>;
  rescueMessages: RescueMessage[];
  currentRoute: any;
  sendRescueMessage: (message: string) => void;
  joinRescueChat: (lat: number, lng: number) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (index: number) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  // ✅ FIXED: Safe useAuth with loading check
  const { user, loading } = useAuth();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<SocketNotification[]>([]);
  const [victimLocations, setVictimLocations] = useState<Map<string, Location>>(new Map());
  const [rescueLocations, setRescueLocations] = useState<Map<string, Location>>(new Map());
  const [rescueMessages, setRescueMessages] = useState<RescueMessage[]>([]);
  const [currentRoute, setCurrentRoute] = useState<any>(null);

  // ✅ FIXED: Skip effects until auth loads
  useEffect(() => {
    if (loading || !user) {
      setConnected(false);
      return;
    }

    const socketInstance = socket; // ✅ Direct socket instance

    // Connection events
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    });

    // Notification events
    socketInstance.on("notification:new", (data: SocketNotification) => {
      console.log("🔔 New notification:", data);
      setNotifications((prev) => [data, ...prev]);

      // Browser notifications
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(data.payload?.title || "New Notification", {
          body: data.payload?.message || "You have a new update",
          icon: "/logo.png",
          badge: "/logo.png",
          tag: data.eventType,
        });
      }
    });

    // Victim locations (rescue/logistics)
    if (user.role === "rescue" || user.role === "logistics") {
      socketInstance.on("victimLocation", (data: { userId: string; lat: number; lng: number }) => {
        console.log("📍 Victim location:", data);
        setVictimLocations((prev) => {
          const updated = new Map(prev);
          updated.set(data.userId, { lat: data.lat, lng: data.lng });
          return updated;
        });
      });
    }

    // Rescue locations (logistics only)
    if (user.role === "logistics") {
      socketInstance.on("rescueLocation", (data: { userId: string; lat: number; lng: number }) => {
        console.log("🚑 Rescue location:", data);
        setRescueLocations((prev) => {
          const updated = new Map(prev);
          updated.set(data.userId, { lat: data.lat, lng: data.lng });
          return updated;
        });
      });
    }

    // Rescue chat (rescue teams only)
    if (user.role === "rescue") {
      socketInstance.on("rescue:new-message", (msg: RescueMessage) => {
        console.log("💬 Rescue message:", msg);
        setRescueMessages((prev) => [...prev, msg]);
      });

      socketInstance.on("rescue:joined-room", (data: { roomId: string }) => {
        console.log("✅ Joined rescue room:", data.roomId);
      });
    }

    // Route updates
    socketInstance.on("route:update", (route: any) => {
      console.log("🗺️ Route update:", route);
      setCurrentRoute(route);
    });

    // Connect socket
    socketInstance.connect();

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("notification:new");
      socketInstance.off("victimLocation");
      socketInstance.off("rescueLocation");
      socketInstance.off("rescue:new-message");
      socketInstance.off("rescue:joined-room");
      socketInstance.off("route:update");
      socketInstance.disconnect();
    };
  }, [user, loading]);

  const sendRescueMessage = (message: string) => {
    if (!message.trim() || !user) return;
    socket.emit("rescue:send-message", { message });
  };

  const joinRescueChat = (lat: number, lng: number) => {
    if (!user) return;
    socket.emit("rescue:join-nearby", { lat, lng });
  };

  const clearNotifications = () => setNotifications([]);
  const markNotificationAsRead = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ FIXED: Safe context value
  const value: SocketContextType = {
    connected,
    notifications,
    victimLocations,
    rescueLocations,
    rescueMessages,
    currentRoute,
    sendRescueMessage,
    joinRescueChat,
    clearNotifications,
    markNotificationAsRead,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
