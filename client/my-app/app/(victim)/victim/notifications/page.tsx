"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { useSocket } from "@/contexts/SocketContext";

/* ---------- BACKEND-SYNCED TYPES ---------- */
type NotificationType = "success" | "warning" | "info" | "alert";

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

/* ---------- HELPERS ---------- */
function mapEventToType(eventType: string): NotificationType {
  if (eventType.includes("CRITICAL")) return "alert";
  if (eventType.includes("FAIL")) return "warning";
  if (eventType.includes("SUCCESS")) return "success";
  return "info";
}

function formatRelativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

/* ---------- MAIN COMPONENT ---------- */
export default function NotificationsPage() {
  const { notifications: socketNotifications } = useSocket();

  console.log("🟡 socketNotifications:", socketNotifications);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all",
  );

  /* ---------- SYNC SOCKET → UI ---------- */
  useEffect(() => {
    if (!socketNotifications.length) return;

    setNotifications((prev) => {
      const mapped = socketNotifications.map((n) => ({
        id: crypto.randomUUID(),
        type: mapEventToType(n.eventType),
        title: n.payload?.title || "System Update",
        message: n.payload?.message || "You have a new notification",
        timestamp: n.payload?.createdAt || new Date().toISOString(),
        read: false,
        actionable: !!n.payload?.actionable,
      }));

      return [...mapped, ...prev];
    });
  }, [socketNotifications]);

  /* ---------- DERIVED ---------- */
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  /* ---------- ACTIONS ---------- */
  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  /* ---------- UI HELPERS ---------- */
  const iconMap = {
    success: <CheckCircle className="text-green-400" size={24} />,
    warning: <AlertTriangle className="text-yellow-400" size={24} />,
    info: <Info className="text-blue-400" size={24} />,
    alert: <Bell className="text-red-400" size={24} />,
  };

  const colorMap = {
    success: "border-green-500/30 bg-green-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
    alert: "border-red-500/30 bg-red-500/10",
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <Sidebar role="victim" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white flex gap-3 items-center">
              <Bell className="text-blue-400" /> Notifications
            </h1>
            <p className="text-gray-400">
              {unreadCount
                ? `${unreadCount} unread notification(s)`
                : "All caught up!"}
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "unread", "alert", "warning", "success", "info"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-gray-400"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto px-4 py-2 bg-white/5 text-gray-300 rounded-lg"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Empty */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <BellOff size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications to show</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`border rounded-2xl p-6 ${
                  n.read ? "opacity-70 border-white/10" : colorMap[n.type]
                }`}
              >
                <div className="flex gap-4">
                  {iconMap[n.type]}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {n.title}
                      </h3>
                      <div className="flex gap-2">
                        {!n.read && (
                          <button onClick={() => markAsRead(n.id)}>
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(n.id)}>
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mt-1">{n.message}</p>

                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span className="flex gap-1 items-center">
                        <Clock size={14} />
                        {formatRelativeTime(n.timestamp)}
                      </span>

                      {n.actionable && !n.read && (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
