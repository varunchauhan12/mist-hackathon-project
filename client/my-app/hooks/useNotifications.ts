"use client";

import { useState, useEffect } from "react";
import notificationApi from "@/lib/api/notificationApi";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request permission
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setError("Notifications not supported");
      return false;
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm === "granted";
  };

  // Subscribe to push notifications
  const subscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Request permission first
      const granted = await requestPermission();
      if (!granted) {
        throw new Error("Notification permission denied");
      }

      // Register service worker
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      // Send subscription to backend
      await notificationApi.subscribe(subscription.toJSON() as any);

      setIsSubscribed(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to subscribe to notifications");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe
  const unsubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to unsubscribe");
    } finally {
      setLoading(false);
    }
  };

  // Check if already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (err) {
          console.error("Error checking subscription:", err);
        }
      }
    };

    checkSubscription();
  }, []);

  return {
    permission,
    isSubscribed,
    loading,
    error,
    subscribe,
    unsubscribe,
    requestPermission,
  };
};

// Helper function
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
