"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "./AuthContext";
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
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<SocketNotification[]>([]);
  const [victimLocations, setVictimLocations] = useState(new Map());
  const [rescueLocations, setRescueLocations] = useState(new Map());
  const [rescueMessages, setRescueMessages] = useState<RescueMessage[]>([]);
  const [currentRoute, setCurrentRoute] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const socketInstance = socket.getSocket();

    if (socketInstance) {
      // Connection events
      socketInstance.on("connect", () => {
        console.log("✅ Socket connected in context");
        setConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("❌ Socket disconnected in context");
        setConnected(false);
      });

      // Notification events
      socketInstance.on("notification:new", (data: SocketNotification) => {
        console.log("🔔 New notification:", data);
        setNotifications((prev) => [data, ...prev]);

        // Show browser notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(data.payload?.title || "New Notification", {
            body: data.payload?.message || "You have a new update",
            icon: "/logo.png",
            badge: "/logo.png",
            tag: data.eventType,
          });
        }
      });

      // Location tracking for rescue & logistics
      if (user.role === "rescue" || user.role === "logistics") {
        socketInstance.on(
          "victimLocation",
          (data: { userId: string; lat: number; lng: number }) => {
            console.log("📍 Victim location update:", data);
            setVictimLocations((prev) => {
              const updated = new Map(prev);
              updated.set(data.userId, { lat: data.lat, lng: data.lng });
              return updated;
            });
          }
        );
      }

      // Location tracking for logistics only
      if (user.role === "logistics") {
        socketInstance.on(
          "rescueLocation",
          (data: { userId: string; lat: number; lng: number }) => {
            console.log("🚑 Rescue location update:", data);
            setRescueLocations((prev) => {
              const updated = new Map(prev);
              updated.set(data.userId, { lat: data.lat, lng: data.lng });
              return updated;
            });
          }
        );
      }

      // Rescue chat for rescue teams
      if (user.role === "rescue") {
        socketInstance.on("rescue:new-message", (msg: RescueMessage) => {
          console.log("💬 New rescue message:", msg);
          setRescueMessages((prev) => [...prev, msg]);
        });

        socketInstance.on("rescue:joined-room", (data: { roomId: string }) => {
          console.log("✅ Joined rescue chat room:", data.roomId);
        });
      }

      // Route updates (for rescue teams)
      socketInstance.on("route:update", (route: any) => {
        console.log("🗺️ Route updated:", route);
        setCurrentRoute(route);
      });
    }

    return () => {
      const socketInstance = socket.getSocket();
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("notification:new");
        socketInstance.off("victimLocation");
        socketInstance.off("rescueLocation");
        socketInstance.off("rescue:new-message");
        socketInstance.off("rescue:joined-room");
        socketInstance.off("route:update");
      }
    };
  }, [user]);

  const sendRescueMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("rescue:send-message", { message });
  };

  const joinRescueChat = (lat: number, lng: number) => {
    socket.emit("rescue:join-nearby", { lat, lng });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationAsRead = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SocketContext.Provider
      value={{
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
      }}
    >
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
