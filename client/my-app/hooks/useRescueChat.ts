"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type RescueMessage = {
  senderId: string;
  message: string;
  timestamp: string | Date;
};

export const useRescueChat = (lat: number | null, lng: number | null) => {
  const [messages, setMessages] = useState<RescueMessage[]>([]);

  useEffect(() => {
    if (lat == null || lng == null) return;

    socket.emit("rescue:join-nearby", { lat, lng });

    const handleNewMessage = (msg: RescueMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("rescue:new-message", handleNewMessage);

    return () => {
      socket.off("rescue:new-message", handleNewMessage);
    };
  }, [lat, lng]);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("rescue:send-message", { message });
  };

  return {
    messages,
    sendMessage,
  };
};
