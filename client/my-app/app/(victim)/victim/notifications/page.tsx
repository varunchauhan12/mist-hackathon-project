"use client";

import { useState } from "react";
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  Trash2,
  Filter,
  X
} from "lucide-react";

/* ---------- TYPES ---------- */
interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

/* ---------- MOCK DATA ---------- */
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Emergency Response Assigned",
    message: "Alpha Team has been dispatched to your location. ETA: 8 minutes.",
    timestamp: "2 minutes ago",
    read: false,
    actionable: true,
  },
  {
    id: "2",
    type: "success",
    title: "Help Request Confirmed",
    message: "Your emergency request has been received and verified. Help is on the way.",
    timestamp: "15 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Weather Alert",
    message: "Heavy rainfall expected in your area. Please stay indoors and avoid flood-prone zones.",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Safe Zone Update",
    message: "Community Center safe zone is now operating at 75% capacity. 50 spaces available.",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Rescue Operation Completed",
    message: "Your previous emergency request has been resolved. Thank you for using COMMANDR.",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "info",
    title: "System Maintenance Notice",
    message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM. Services may be temporarily unavailable.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "7",
    type: "alert",
    title: "New Emergency Protocol",
    message: "Updated emergency response procedures are now in effect. Review guidelines in Help section.",
    timestamp: "2 days ago",
    read: true,
  },
];

/* ---------- SIDEBAR ---------- */
function Sidebar({ role }: { role: "victim" }) {
  const links = [
    { name: "Dashboard", path: "/victim/dashboard" },
    { name: "Report Emergency", path: "/victim/report" },
    { name: "My Requests", path: "/victim/status", badge: 3 },
    { name: "Safe Zones", path: "/victim/safe-zones" },
    { name: "Notifications", path: "/victim/notifications", badge: 2 },
  ];

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-r border-blue-500/20 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-white mb-3">COMMANDR</h2>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-white/5 border border-blue-500/20">
          Citizen Portal
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <button
            key={link.name}
            className="w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-300 border border-transparent transition-all hover:bg-blue-500/10 hover:border-blue-500/40"
          >
            <span className="font-medium text-sm">{link.name}</span>
            {link.badge && (
              <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {link.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="space-y-2 pt-6 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 border border-transparent transition-all hover:bg-blue-500/10 hover:border-blue-500/40">
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/40 border border-transparent transition-all">
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">© 2026 COMMANDR Platform</p>
      </div>
    </aside>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "success" | "warning" | "info" | "alert">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-400" size={24} />;
      case "warning":
        return <AlertTriangle className="text-yellow-400" size={24} />;
      case "info":
        return <Info className="text-blue-400" size={24} />;
      case "alert":
        return <Bell className="text-red-400" size={24} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500/30 bg-green-500/10 hover:border-green-500/50";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-500/50";
      case "info":
        return "border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50";
      case "alert":
        return "border-red-500/30 bg-red-500/10 hover:border-red-500/50";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <Sidebar role="victim" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Bell size={36} className="text-blue-400" />
              Notifications
            </h1>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all text-sm"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                  filter === "unread"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter("alert")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "alert"
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Alerts
              </button>
              <button
                onClick={() => setFilter("warning")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "warning"
                    ? "bg-yellow-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Warnings
              </button>
              <button
                onClick={() => setFilter("success")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "success"
                    ? "bg-green-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setFilter("info")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "info"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Info
              </button>
            </div>

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all text-sm flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <BellOff size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Notifications</h3>
            <p className="text-gray-400">
              {filter === "all" 
                ? "You're all caught up! No notifications to display."
                : `No ${filter} notifications found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                  notification.read 
                    ? "border-white/10 opacity-75" 
                    : getNotificationColor(notification.type)
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-lg font-semibold ${notification.read ? "text-gray-400" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle size={16} className="text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>

                    <p className={`text-sm mb-3 ${notification.read ? "text-gray-500" : "text-gray-300"}`}>
                      {notification.message}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{notification.timestamp}</span>
                      </div>

                      {notification.actionable && !notification.read && (
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all">
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

        {/* Summary Stats */}
        {notifications.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total Notifications</p>
              <p className="text-3xl font-bold text-white">{notifications.length}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Unread</p>
              <p className="text-3xl font-bold text-blue-400">{unreadCount}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Alerts</p>
              <p className="text-3xl font-bold text-red-400">
                {notifications.filter(n => n.type === "alert").length}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Success</p>
              <p className="text-3xl font-bold text-green-400">
                {notifications.filter(n => n.type === "success").length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}